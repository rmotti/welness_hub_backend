import express from 'express';
import userController from '../controller/user.controller.js';
import measurementController from '../controller/measurement.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

// =============================================================================
// AUTH
// =============================================================================

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação e perfil do usuário logado
 *   - name: Students
 *     description: Gestão de alunos pelo personal
 *   - name: Measurements
 *     description: Medidas e evolução física do aluno
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário (personal)
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
 *                 example: personal
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
 *         description: Filtrar por status (ativo/inativo)
 *     responses:
 *       200:
 *         description: Lista de alunos
 *       401:
 *         description: Não autorizado
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
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autorizado
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
 *       404:
 *         description: Aluno não encontrado
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
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/students/:id', verifyToken, userController.getStudentById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefone:
 *                 type: string
 *               objetivo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/students', verifyToken, userController.createStudent);
router.put('/students/:id', verifyToken, userController.updateUser);
router.delete('/students/:id', verifyToken, userController.deleteUser);

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
 */
router.get('/students/:id/measurements', verifyToken, measurementController.getMeasurements);

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
 */
router.get('/students/:id/measurements/latest', verifyToken, measurementController.getLatestMeasurement);

/**
 * @swagger
 * /students/{id}/measurements:
 *   post:
 *     summary: Registra uma nova medida para o aluno
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
 */
router.post('/students/:id/measurements', verifyToken, measurementController.createMeasurement);

export default router;
