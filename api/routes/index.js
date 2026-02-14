import express from 'express';
import verifyToken from '../middleware/jwt.token.middleware.js';
import userController from '../controller/user.controller.js';
import exerciseController from '../controller/exercise.controller.js';
import workoutController from '../controller/workout.controller.js';
import assignmentController from '../controller/assignment.controller.js';
import measurementController from '../controller/measurement.controller.js';

const router = express.Router();

// =============================================================================
// SWAGGER - DEFINIÇÃO DE SCHEMAS
// =============================================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "personal@email.com"
 *         password:
 *           type: string
 *           example: "senha123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *               enum: [ADMIN, ALUNO]
 *             personal_id:
 *               type: integer
 *
 *     RegisterRequest:
 *       type: object
 *       required: [nome, email, password]
 *       properties:
 *         nome:
 *           type: string
 *           example: "João Personal"
 *         email:
 *           type: string
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           example: "senha123"
 *         role:
 *           type: string
 *           enum: [ADMIN, ALUNO]
 *           default: ALUNO
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, ALUNO]
 *         status:
 *           type: string
 *           enum: [Ativo, Inativo]
 *         objetivo:
 *           type: string
 *         telefone:
 *           type: string
 *         personal_id:
 *           type: integer
 *
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         telefone:
 *           type: string
 *         objetivo:
 *           type: string
 *
 *     StudentRequest:
 *       type: object
 *       required: [nome, email, password]
 *       properties:
 *         nome:
 *           type: string
 *           example: "Maria Aluna"
 *         email:
 *           type: string
 *           example: "maria@email.com"
 *         password:
 *           type: string
 *           example: "senha123"
 *         telefone:
 *           type: string
 *           example: "(11) 99999-0000"
 *         objetivo:
 *           type: string
 *           example: "Emagrecimento"
 *
 *     DashboardStats:
 *       type: object
 *       properties:
 *         total_alunos:
 *           type: integer
 *           example: 15
 *         treinos_ativos:
 *           type: integer
 *           example: 8
 *         medidas_pendentes:
 *           type: integer
 *           example: 3
 *
 *     Measurement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         usuario_id:
 *           type: integer
 *         peso:
 *           type: number
 *           format: float
 *           example: 75.50
 *         altura:
 *           type: number
 *           format: float
 *           example: 1.75
 *         bf_percentual:
 *           type: number
 *           format: float
 *           example: 18.50
 *         data_medicao:
 *           type: string
 *           format: date
 *           example: "2026-02-13"
 *
 *     MeasurementRequest:
 *       type: object
 *       properties:
 *         peso:
 *           type: number
 *           format: float
 *           example: 75.50
 *         altura:
 *           type: number
 *           format: float
 *           example: 1.75
 *         bf_percentual:
 *           type: number
 *           format: float
 *           example: 18.50
 *         data_medicao:
 *           type: string
 *           format: date
 *           example: "2026-02-13"
 *
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         grupo_muscular:
 *           type: string
 *         link_video:
 *           type: string
 *         descricao:
 *           type: string
 *
 *     ExerciseRequest:
 *       type: object
 *       required: [nome]
 *       properties:
 *         nome:
 *           type: string
 *           example: "Supino Reto"
 *         grupo_muscular:
 *           type: string
 *           example: "Peito"
 *         descricao:
 *           type: string
 *           example: "Exercício para peitoral"
 *
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome_treino:
 *           type: string
 *         objetivo_treino:
 *           type: string
 *         descricao:
 *           type: string
 *
 *     WorkoutRequest:
 *       type: object
 *       required: [nome]
 *       properties:
 *         nome:
 *           type: string
 *           example: "Treino A - Hipertrofia"
 *         descricao:
 *           type: string
 *           example: "Treino focado em membros superiores"
 *
 *     WorkoutExercise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         treino_id:
 *           type: integer
 *         exercicio_id:
 *           type: integer
 *         ordem:
 *           type: integer
 *         series:
 *           type: integer
 *         repeticoes:
 *           type: string
 *         descanso_segundos:
 *           type: integer
 *         observacao_especifica:
 *           type: string
 *
 *     WorkoutExerciseRequest:
 *       type: object
 *       required: [exercicio_id]
 *       properties:
 *         exercicio_id:
 *           type: integer
 *           example: 1
 *         series:
 *           type: integer
 *           example: 4
 *         repeticoes:
 *           type: string
 *           example: "10-12"
 *         ordem:
 *           type: integer
 *           example: 1
 *         descanso_segundos:
 *           type: integer
 *           example: 60
 *         observacao_especifica:
 *           type: string
 *           example: "Manter cotovelos a 45 graus"
 *
 *     Assignment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         usuario_id:
 *           type: integer
 *         treino_id:
 *           type: integer
 *         data_inicio:
 *           type: string
 *           format: date
 *         data_fim:
 *           type: string
 *           format: date
 *         status_treino:
 *           type: string
 *           enum: [Ativo, Finalizado]
 *
 *     AssignmentRequest:
 *       type: object
 *       required: [aluno_id, treino_id]
 *       properties:
 *         aluno_id:
 *           type: integer
 *           example: 5
 *         treino_id:
 *           type: integer
 *           example: 2
 *         data_inicio:
 *           type: string
 *           format: date
 *           example: "2026-02-13"
 *         data_fim:
 *           type: string
 *           format: date
 *           example: "2026-04-13"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

// =============================================================================
// 1. AUTENTICAÇÃO & SESSÃO (/auth)
// =============================================================================

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Login, registro e perfil do usuário
 *   - name: Dashboard
 *     description: KPIs e estatísticas para a Home do Personal
 *   - name: Alunos
 *     description: CRUD de alunos vinculados ao Personal
 *   - name: Medidas
 *     description: Histórico corporal e evolução do aluno
 *   - name: Exercícios
 *     description: Catálogo de exercícios disponíveis
 *   - name: Treinos
 *     description: Modelos/templates de treino
 *   - name: Treino - Exercícios
 *     description: Montagem do treino (adicionar exercícios ao template)
 *   - name: Atribuições
 *     description: Vincular treinos a alunos (fichas)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       409:
 *         description: Email já está em uso
 */
router.post('/auth/register', userController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar login e obter token JWT
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Senha incorreta
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/auth/login', userController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retornar dados do usuário logado
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Dados do perfil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Token não fornecido
 */
router.get('/auth/me', verifyToken, userController.getMe);

/**
 * @swagger
 * /auth/me:
 *   put:
 *     summary: Atualizar próprio perfil (senha, telefone, objetivo)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.put('/auth/me', verifyToken, userController.updateMe);

// =============================================================================
// 2. DASHBOARD (/dashboard)
// =============================================================================

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Retornar KPIs do personal (Total Alunos, Treinos Ativos, Medidas Pendentes)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Estatísticas do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 */
router.get('/dashboard/stats', verifyToken, userController.getDashboard);

// =============================================================================
// 3. GESTÃO DE ALUNOS (/students)
// =============================================================================

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Listar todos os alunos do personal
 *     tags: [Alunos]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Ativo, Inativo]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/students', verifyToken, userController.getAllStudents);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cadastrar novo aluno (gera senha provisória)
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *       409:
 *         description: Email já cadastrado
 */
router.post('/students', verifyToken, userController.createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Editar dados cadastrais do aluno
 *     tags: [Alunos]
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
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       200:
 *         description: Dados atualizados
 *       404:
 *         description: Aluno não encontrado
 */
router.put('/students/:id', verifyToken, userController.updateUser);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Inativar aluno (Soft Delete)
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno inativado com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.delete('/students/:id', verifyToken, userController.deleteUser);

// =============================================================================
// 4. MEDIDAS & EVOLUÇÃO (/students/:id/measurements)
// =============================================================================

/**
 * @swagger
 * /students/{id}/measurements:
 *   get:
 *     summary: Histórico completo de medidas do aluno
 *     tags: [Medidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Lista de medidas ordenadas por data (mais recente primeiro)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Measurement'
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/students/:id/measurements', verifyToken, measurementController.getMeasurements);

/**
 * @swagger
 * /students/{id}/measurements/latest:
 *   get:
 *     summary: Retornar apenas a medida mais recente do aluno
 *     tags: [Medidas]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measurement'
 *       404:
 *         description: Aluno ou medida não encontrada
 */
router.get('/students/:id/measurements/latest', verifyToken, measurementController.getLatestMeasurement);

/**
 * @swagger
 * /students/{id}/measurements:
 *   post:
 *     summary: Adicionar nova avaliação/medição do aluno
 *     tags: [Medidas]
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
 *             $ref: '#/components/schemas/MeasurementRequest'
 *     responses:
 *       201:
 *         description: Medida registrada com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.post('/students/:id/measurements', verifyToken, measurementController.createMeasurement);

// =============================================================================
// 5. CATÁLOGO DE EXERCÍCIOS (/exercises)
// =============================================================================

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Listar todos os exercícios cadastrados
 *     tags: [Exercícios]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do exercício
 *       - in: query
 *         name: grupo_muscular
 *         schema:
 *           type: string
 *         description: Filtrar por grupo muscular
 *     responses:
 *       200:
 *         description: Lista de exercícios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 */
router.get('/exercises', verifyToken, exerciseController.getExercises);

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Cadastrar novo exercício
 *     tags: [Exercícios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseRequest'
 *     responses:
 *       201:
 *         description: Exercício criado com sucesso
 */
router.post('/exercises', verifyToken, exerciseController.createExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Atualizar exercício (nome, vídeo, etc)
 *     tags: [Exercícios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exercício
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseRequest'
 *     responses:
 *       200:
 *         description: Exercício atualizado com sucesso
 *       404:
 *         description: Exercício não encontrado
 */
router.put('/exercises/:id', verifyToken, exerciseController.updateExercise);

// =============================================================================
// 6. GESTÃO DE TREINOS - TEMPLATES (/workouts)
// =============================================================================

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Listar modelos de treino do personal
 *     tags: [Treinos]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do treino
 *     responses:
 *       200:
 *         description: Lista de treinos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 */
router.get('/workouts', verifyToken, workoutController.getAll);

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Criar novo modelo de treino
 *     tags: [Treinos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutRequest'
 *     responses:
 *       201:
 *         description: Treino criado com sucesso
 */
router.post('/workouts', verifyToken, workoutController.create);

/**
 * @swagger
 * /workouts/{id}:
 *   put:
 *     summary: Editar nome ou descrição do treino
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutRequest'
 *     responses:
 *       200:
 *         description: Treino atualizado
 *       404:
 *         description: Treino não encontrado
 */
router.put('/workouts/:id', verifyToken, workoutController.update);

// =============================================================================
// 7. MONTAGEM DO TREINO - EXERCÍCIOS (/workouts/:workoutId/exercises)
// =============================================================================

/**
 * @swagger
 * /workouts/{workoutId}/exercises:
 *   get:
 *     summary: Listar exercícios de um treino com séries/reps
 *     tags: [Treino - Exercícios]
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     responses:
 *       200:
 *         description: Lista de exercícios do treino
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutExercise'
 */
router.get('/workouts/:workoutId/exercises', verifyToken, workoutController.getExercises);

/**
 * @swagger
 * /workouts/{workoutId}/exercises:
 *   post:
 *     summary: Adicionar exercício ao treino
 *     tags: [Treino - Exercícios]
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutExerciseRequest'
 *     responses:
 *       201:
 *         description: Exercício adicionado ao treino
 *       404:
 *         description: Treino não encontrado
 */
router.post('/workouts/:workoutId/exercises', verifyToken, workoutController.addExercise);

/**
 * @swagger
 * /workouts/{workoutId}/exercises/{exerciseId}:
 *   put:
 *     summary: Atualizar séries/reps de um exercício no treino
 *     tags: [Treino - Exercícios]
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exercício
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutExerciseRequest'
 *     responses:
 *       200:
 *         description: Item atualizado
 *       404:
 *         description: Exercício não encontrado neste treino
 */
router.put('/workouts/:workoutId/exercises/:exerciseId', verifyToken, workoutController.updateExerciseItem);

/**
 * @swagger
 * /workouts/{workoutId}/exercises/{exerciseId}:
 *   delete:
 *     summary: Remover exercício do treino
 *     tags: [Treino - Exercícios]
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exercício
 *     responses:
 *       200:
 *         description: Exercício removido do treino
 *       404:
 *         description: Exercício não encontrado neste treino
 */
router.delete('/workouts/:workoutId/exercises/:exerciseId', verifyToken, workoutController.removeExercise);

// =============================================================================
// 8. ATRIBUIÇÃO - FICHAS DO ALUNO (/assignments, /students/:id/workouts)
// =============================================================================

/**
 * @swagger
 * /students/{id}/workouts:
 *   get:
 *     summary: Listar fichas de treino do aluno (Ativas e Finalizadas)
 *     tags: [Atribuições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Lista de fichas do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/students/:id/workouts', verifyToken, assignmentController.getStudentWorkouts);

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Vincular um treino a um aluno
 *     tags: [Atribuições]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentRequest'
 *     responses:
 *       201:
 *         description: Treino atribuído com sucesso
 *       404:
 *         description: Aluno ou treino não encontrado
 *       409:
 *         description: Treino já está ativo para este aluno
 */
router.post('/assignments', verifyToken, assignmentController.assignWorkout);

/**
 * @swagger
 * /assignments/{id}/finish:
 *   patch:
 *     summary: Marcar ficha como "Finalizada"
 *     tags: [Atribuições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atribuição
 *     responses:
 *       200:
 *         description: Ficha finalizada com sucesso
 *       400:
 *         description: Ficha já está finalizada
 *       404:
 *         description: Atribuição não encontrada
 */
router.patch('/assignments/:id/finish', verifyToken, assignmentController.finishAssignment);

export default router;
