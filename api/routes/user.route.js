import express from 'express';
import userController from '../controller/user.controller.js';
import measurementController from '../controller/measurement.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import authorize from '../middleware/authorize.middleware.js';
import ownsStudent from '../middleware/owns-student.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão geral de usuários (somente admin)
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e perfil do usuário logado
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Gestão de alunos pelo personal
 */

/**
 * @swagger
 * tags:
 *   name: Measurements
 *   description: Medidas e evolução física do aluno
 */

// =============================================================================
// USERS (Admin)
// =============================================================================

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários, com filtro opcional por role (somente admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, trainer, student]
 *         description: Filtrar por role
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 */
router.get('/users', verifyToken, authorize('admin'), userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza qualquer usuário pelo ID (somente admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, trainer, student]
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *               telefone:
 *                 type: string
 *               objetivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/users/:id', verifyToken, authorize('admin'), userController.updateUser);

// =============================================================================
// AUTH
// =============================================================================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário (personal/trainer)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, password]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *               role:
 *                 type: string
 *                 enum: [admin, trainer]
 *                 example: trainer
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/auth/register', userController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, trainer, student]
 *                     student_id:
 *                       type: integer
 *                       nullable: true
 *       400:
 *         description: Email e senha são obrigatórios
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/auth/login', userController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/auth/me', verifyToken, userController.getMe);

/**
 * @swagger
 * /auth/me:
 *   put:
 *     summary: Atualiza dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefone:
 *                 type: string
 *               objetivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
router.put('/auth/me', verifyToken, userController.updateMe);

// =============================================================================
// STUDENTS
// =============================================================================

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Lista todos os alunos do personal autenticado
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do aluno
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status (Ativo/Inativo)
 *     responses:
 *       200:
 *         description: Lista de alunos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 */
router.get('/students', verifyToken, userController.getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Busca um aluno pelo ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Dados do aluno
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (aluno tentando ver dados de outro aluno)
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/students/:id', verifyToken, ownsStudent, userController.getStudentById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo aluno e seu acesso de login (trainer/admin)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, studentPassword]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Souza
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               studentPassword:
 *                 type: string
 *                 description: Senha de acesso do aluno (será armazenada com hash bcrypt)
 *                 example: senha_do_aluno_123
 *               telefone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               objetivo:
 *                 type: string
 *                 example: Emagrecimento
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso (registro e acesso criados em transaction)
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 *       409:
 *         description: Email já cadastrado
 */
router.post('/students', verifyToken, authorize('trainer'), userController.createStudent);
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza dados de um aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               objetivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dados atualizados
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 *       404:
 *         description: Aluno não encontrado
 */
router.put('/students/:id', verifyToken, authorize('trainer'), userController.updateUser);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove (inativa) um aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 *       404:
 *         description: Aluno não encontrado
 */
router.delete('/students/:id', verifyToken, authorize('trainer'), userController.deleteUser);

/**
 * @swagger
 * /students/{id}/reset-password:
 *   post:
 *     summary: Redefine a senha de um aluno (somente trainer/admin)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: novaSenha456
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: newPassword é obrigatório
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 *       404:
 *         description: Aluno não encontrado
 */
router.post('/students/:id/reset-password', verifyToken, authorize('trainer'), userController.resetStudentPassword);

// =============================================================================
// MEASUREMENTS
// =============================================================================

/**
 * @swagger
 * /students/{id}/measurements:
 *   get:
 *     summary: Lista todas as medidas de um aluno
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Lista de medidas
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/students/:id/measurements', verifyToken, ownsStudent, measurementController.getMeasurements);

/**
 * @swagger
 * /students/{id}/measurements/latest:
 *   get:
 *     summary: Retorna a medida mais recente do aluno
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Última medida registrada
 *       404:
 *         description: Nenhuma medida encontrada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/students/:id/measurements/latest', verifyToken, ownsStudent, measurementController.getLatestMeasurement);

/**
 * @swagger
 * /students/{id}/measurements:
 *   post:
 *     summary: Registra uma nova medida para o aluno (somente trainer/admin)
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               peso:
 *                 type: number
 *                 example: 75.5
 *               altura:
 *                 type: number
 *                 example: 1.78
 *               gordura_corporal:
 *                 type: number
 *                 example: 18.5
 *               massa_muscular:
 *                 type: number
 *                 example: 35.0
 *     responses:
 *       201:
 *         description: Medida registrada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 */
router.post('/students/:id/measurements', verifyToken, authorize('trainer'), measurementController.createMeasurement);

export default router;
