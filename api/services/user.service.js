import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const User = db.users;
const Op = db.Sequelize.Op;

// --- AUTENTICAÇÃO ---

const registerUser = async ({ nome, email, password, role }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw { status: 409, message: 'Email já está em uso.' };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await User.create({
        nome,
        email,
        password: hashedPassword,
        role: role || 'trainer',
        status: 'Ativo'
    });
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user) throw { status: 404, message: 'Usuário não encontrado.' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, message: 'Senha incorreta.' };

    if (user.status !== 'Ativo') throw { status: 403, message: 'Usuário inativo.' };

    // Gera token com ID, ROLE e STUDENT_ID (para alunos)
    const token = jwt.sign(
        { id: user.id, role: user.role, studentId: user.student_id || null },
        process.env.JWT_SECRET || 'SEGREDO_SUPER_SECRETO',
        { expiresIn: '8h' }
    );

    return {
        token,
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            personal_id: user.personal_id,
            student_id: user.student_id
        }
    };
};

// --- GESTÃO DE ALUNOS ---

const getAllAlunos = async (personalId, filters) => {
    const { nome, status } = filters;

    // Filtro: Apenas alunos vinculados a este Personal (personalId)
    // Suporta role 'student' (novo) e 'ALUNO' (legado) para retrocompatibilidade
    let condition = {
        role: { [Op.in]: ['student', 'ALUNO'] },
        personal_id: personalId
    };

    if (nome) condition.nome = { [Op.iLike]: `%${nome}%` };

    if (status) condition.status = status;

    return await User.findAll({
        where: condition,
        attributes: { exclude: ['password'] }
    });
};

const createAluno = async (data, personalId) => {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) throw { status: 409, message: 'Email já cadastrado.' };

    // studentPassword é o campo dedicado para a senha do aluno (Fase 1 — RBAC).
    // Fallback para 'password' (retrocompat) ou 'mudar123' se nenhum for enviado.
    const plainPassword = data.studentPassword || data.password || 'mudar123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Usa transaction para garantir atomicidade: se qualquer etapa falhar, desfaz tudo.
    const transaction = await db.sequelize.transaction();
    try {
        const student = await User.create({
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            objetivo: data.objetivo,
            password: hashedPassword,
            role: 'student',
            personal_id: personalId,
            status: 'Ativo',
            student_id: null // Será atualizado logo após a criação
        }, { transaction });

        // Vincula o student_id ao próprio id do registro recém-criado
        await student.update({ student_id: student.id }, { transaction });

        await transaction.commit();

        // Retorna sem o campo password
        const { password: _, ...studentData } = student.toJSON();
        studentData.student_id = student.id;
        return studentData;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const resetStudentPassword = async (studentId, newPassword) => {
    const student = await User.findOne({
        where: { id: studentId, role: { [Op.in]: ['student', 'ALUNO'] } }
    });
    if (!student) throw { status: 404, message: 'Aluno não encontrado.' };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await student.update({ password: hashedPassword });
    return { message: 'Senha do aluno redefinida com sucesso.' };
};

const getAllUsers = async (filters = {}) => {
    const { role } = filters;
    const condition = {};
    if (role) condition.role = role;

    return await User.findAll({
        where: condition,
        attributes: { exclude: ['password'] }
    });
};

const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw { status: 404, message: 'Usuário não encontrado' };

    // Soft Delete (Apenas inativa)
    await user.update({ status: 'Inativo' });
    return { message: 'Usuário inativado com sucesso.' };
};

// --- GENÉRICO & DASHBOARD ---

const getUserById = async (id) => {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!user) throw { status: 404, message: 'Usuário não encontrado' };

    return user;
};

const updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) throw { status: 404, message: 'Usuário não encontrado' };

    // Se vier senha nova, faz o hash antes de salvar
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }

    await user.update(data);
    return await User.findByPk(id, { attributes: { exclude: ['password'] }});
};

const getDashboardStats = async (personalId) => {
    const UserWorkout = db.user_workouts;
    const Measurement = db.measurements;

    // Suporta role 'student' (novo) e 'ALUNO' (legado) para retrocompatibilidade
    const roleFilter = { [Op.in]: ['student', 'ALUNO'] };

    const totalAlunos = await User.count({
        where: { personal_id: personalId, role: roleFilter, status: 'Ativo' }
    });

    const students = await User.findAll({
        where: { personal_id: personalId, role: roleFilter, status: 'Ativo' },
        attributes: ['id'],
        raw: true
    });
    const studentIds = students.map(s => s.id);

    let treinosAtivos = 0;
    let medidasPendentes = 0;

    if (studentIds.length > 0) {
        treinosAtivos = await UserWorkout.count({
            where: {
                usuario_id: { [Op.in]: studentIds },
                status_treino: 'Ativo'
            }
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const alunosComMedida = await Measurement.findAll({
            where: {
                usuario_id: { [Op.in]: studentIds },
                data_medicao: { [Op.gte]: thirtyDaysAgo }
            },
            attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('usuario_id')), 'usuario_id']],
            raw: true
        });

        const idsComMedida = alunosComMedida.map(m => m.usuario_id);
        medidasPendentes = studentIds.filter(id => !idsComMedida.includes(id)).length;
    }

    return {
        total_alunos: totalAlunos,
        treinos_ativos: treinosAtivos,
        medidas_pendentes: medidasPendentes
    };
};

export default {
    registerUser,
    loginUser,
    getAllUsers,
    getAllAlunos,
    createAluno,
    resetStudentPassword,
    deleteUser,
    getUserById,
    updateUser,
    getDashboardStats
};
