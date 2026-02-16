import express from 'express';
import userController from '../controller/user.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js'; // Importando o middleware

const router = express.Router();

// --- ROTAS PÚBLICAS (Qualquer um acessa) ---
router.post('/register', userController.register); // Opcional (se tiver cadastro aberto)
router.post('/login', userController.login);       // Principal porta de entrada

// --- ROTAS PROTEGIDAS (Precisa de Token) ---

// 1. Identificação ("Quem sou eu?")
router.get('/me', verifyToken, userController.getMe); 
router.put('/me', verifyToken, userController.updateMe);

// 2. Dashboard (KPIs para a Home)
router.get('/dashboard/stats', verifyToken, userController.getDashboard);

// 3. Gestão de Alunos (O Personal gerencia seus alunos)
router.get('/students', verifyToken, userController.getAllStudents);      // Lista todos
router.get('/students/:id', verifyToken, userController.getStudentById);  // <--- ADICIONE ESTA LINHA (Busca detalhes do aluno)
router.post('/students', verifyToken, userController.createStudent);      // Cria
router.put('/students/:id', verifyToken, userController.updateUser);      // Edita
router.delete('/students/:id', verifyToken, userController.deleteUser);   // Remove (Inativa)

export default router;