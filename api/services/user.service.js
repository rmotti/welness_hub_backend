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
        role: role || 'ALUNO',
        status: 'Ativo'
    });
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user) throw { status: 404, message: 'Usuário não encontrado.' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, message: 'Senha incorreta.' };

    if (user.status !== 'Ativo') throw { status: 403, message: 'Usuário inativo.' };

    // Gera token com ID e ROLE
    const token = jwt.sign(
        { id: user.id, role: user.role },
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
            personal_id: user.personal_id
        }
    };
};

// --- GESTÃO DE ALUNOS ---

const getAllAlunos = async (personalId, filters) => {
    const { nome, status } = filters;
    
    // Filtro: Apenas alunos vinculados a este Personal (personalId)
    let condition = { 
        role: 'ALUNO',
        personal_id: personalId 
    };

    // CORREÇÃO: Adicionadas as crases (template literals) para o iLike funcionar
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

    // CORREÇÃO: Fallback caso o front não mande senha (define uma padrão)
    const plainPassword = data.password || 'mudar123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return await User.create({
        ...data,
        password: hashedPassword,
        role: 'ALUNO',
        personal_id: personalId, // Vincula ao Personal que criou
        status: 'Ativo'
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
    // Esta função é chamada pelo Controller no GET /students/:id
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
    const UserWorkout = db.user_workouts; // Verifique se o nome no db.index é este mesmo
    const Measurement = db.measurements;  // Verifique se o nome no db.index é este mesmo

    const totalAlunos = await User.count({
        where: { personal_id: personalId, role: 'ALUNO', status: 'Ativo' }
    });

    const students = await User.findAll({
        where: { personal_id: personalId, role: 'ALUNO', status: 'Ativo' },
        attributes: ['id'],
        raw: true
    });
    const studentIds = students.map(s => s.id);

    let treinosAtivos = 0;
    let medidasPendentes = 0;

    if (studentIds.length > 0) {
        // Contagem de treinos ativos dos alunos desse personal
        treinosAtivos = await UserWorkout.count({
            where: {
                usuario_id: { [Op.in]: studentIds },
                status_treino: 'Ativo'
            }
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Lógica para verificar quem não tem medição nos últimos 30 dias
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
    getAllAlunos,
    createAluno,
    deleteUser,
    getUserById,
    updateUser,
    getDashboardStats
};