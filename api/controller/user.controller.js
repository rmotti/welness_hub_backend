import userService from '../services/user.service.js';

// --- AUTENTICAÇÃO ---

const register = async (req, res) => {
    // Ajuste: O banco usa 'nome', não 'username'
    const { nome, email, password, role } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        const user = await userService.registerUser({ nome, email, password, role });
        return res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // O service retorna { user, token }
        const { user, token } = await userService.loginUser({ email, password });
        
        // Retornamos tudo para o front salvar no localStorage/Context
        return res.status(200).json({ 
            message: 'Login realizado com sucesso!', 
            token,
            user 
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const getMe = async (req, res) => {
    try {
        // req.userId vem do Middleware de JWT (que você já tem)
        const user = await userService.getUserById(req.userId);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// --- GESTÃO DE ALUNOS (Para o Personal) ---

const createStudent = async (req, res) => {
    try {
        // O Personal (req.userId) está criando um Aluno
        // O Service já vai forçar role='ALUNO' e vincular o ID
        const newStudent = await userService.createAluno(req.body, req.userId);
        return res.status(201).json({ message: 'Aluno cadastrado com sucesso!', student: newStudent });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        // Filtros vindos da URL (ex: ?nome=joao&status=Ativo)
        const filters = {
            nome: req.query.nome,
            status: req.query.status
        };
        
        // Passamos o ID do personal para ele só ver OS SEUS alunos
        const students = await userService.getAllAlunos(req.userId, filters);
        return res.status(200).json(students);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Aqui você pode adicionar uma validação extra se quiser impedir 
        // que um personal edite aluno de outro, mas o service ajuda nisso.
        const updatedUser = await userService.updateUser(id, req.body);
        return res.status(200).json({ message: 'Dados atualizados.', user: updatedUser });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await userService.deleteUser(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// --- DASHBOARD ---

const getDashboard = async (req, res) => {
    try {
        const stats = await userService.getDashboardStats(req.userId);
        return res.status(200).json(stats);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

export default {
    register,
    login,
    getMe,
    createStudent,
    getAllStudents,
    updateUser,
    deleteUser,
    getDashboard
};