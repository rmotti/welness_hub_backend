import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; // Importa do index para pegar Op e configurações
const User = db.users; // Pega o model 'users' que definimos no index
const Op = db.Sequelize.Op; // Necessário para filtros (LIKE)

// --- AUTENTICAÇÃO (Login & Registro Público) ---

const registerUser = async ({ nome, email, password, role }) => {
    // Verifica duplicidade
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw { status: 409, message: 'Email já está em uso.' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria usuário (pode ser Admin ou Aluno dependendo do envio, ou padrão Aluno)
    const newUser = await User.create({
        nome,
        email,
        password: hashedPassword,
        role: role || 'aluno', // Se não enviar, cria como aluno
        status: 'Ativo'
    });

    return newUser;
};

const loginUser = async ({ email, password }) => {
    // Busca pelo email
    const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'nome', 'email', 'password', 'role'] // Inclui role para o front saber quem logou
    });

    if (!user) {
        throw { status: 404, message: 'Usuário não encontrado.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Credenciais inválidas.' };
    }

    // Gera token
    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8h' } // Aumentei um pouco o tempo para dashboard
    );

    // Remove a senha do retorno
    const userWithoutPassword = { 
        id: user.id, 
        nome: user.nome, 
        email: user.email, 
        role: user.role 
    };
    
    return { user: userWithoutPassword, token };
};

// --- DASHBOARD (Alunos) ---

const getAllAlunos = async (filters) => {
    const { nome, status } = filters;
    
    // Filtro base: Só traz quem tem role = 'aluno'
    let condition = { role: 'aluno' };

    // Se tiver filtro de nome (busca parcial / case insensitive)
    if (nome) {
        condition.nome = { [Op.iLike]: `%${nome}%` }; 
    }
    // Se tiver filtro de status
    if (status) {
        condition.status = status;
    }

    const alunos = await User.findAll({
        where: condition,
        attributes: { exclude: ['password'] } // Segurança
    });

    return alunos;
};

const createAluno = async (data) => {
    // Reutiliza a lógica de hash de senha, mas força campos específicos
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) throw { status: 409, message: 'Email já cadastrado.' };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const novoAluno = await User.create({
        ...data,
        password: hashedPassword,
        role: 'aluno', // Garante que é aluno
        status: data.status || 'Ativo'
    });

    return novoAluno;
};

// --- GENÉRICO (Admin & Update) ---

const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    if (!user) throw { status: 404, message: 'Usuário não encontrado' };
    return user;
};

const updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) throw { status: 404, message: 'Usuário não encontrado' };

    // Se estiver tentando atualizar a senha, precisa hashear de novo
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }

    await user.update(data);
    
    // Retorna os dados atualizados sem a senha
    const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] }});
    return updatedUser;
};

export default {
    registerUser,
    loginUser,
    getAllAlunos,
    createAluno,
    getUserById,
    updateUser
};