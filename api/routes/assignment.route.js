import express from 'express';
import assignmentController from '../controller/assignment.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Atribuição de fichas de treino para alunos
 */

/**
 * @swagger
 * /students/{id}/workouts:
 *   get:
 *     summary: Lista as fichas de treino atribuídas a um aluno
 *     tags: [Assignments]
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
 *         description: Lista de fichas do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   treino_id:
 *                     type: integer
 *                   aluno_id:
 *                     type: integer
 *                   data_inicio:
 *                     type: string
 *                     format: date
 *                   data_fim:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *       401:
 *         description: Não autorizado
 */
router.get('/students/:id/workouts', verifyToken, assignmentController.getStudentWorkouts);

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Atribui um treino a um aluno
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aluno_id, treino_id]
 *             properties:
 *               aluno_id:
 *                 type: integer
 *                 example: 3
 *               treino_id:
 *                 type: integer
 *                 example: 7
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-01"
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-01"
 *     responses:
 *       201:
 *         description: Treino atribuído com sucesso
 *       400:
 *         description: aluno_id e treino_id são obrigatórios
 *       401:
 *         description: Não autorizado
 */
router.post('/assignments', verifyToken, assignmentController.assignWorkout);

/**
 * @swagger
 * /assignments/{id}/finish:
 *   patch:
 *     summary: Finaliza uma ficha de treino do aluno
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ficha (assignment)
 *     responses:
 *       200:
 *         description: Ficha finalizada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Ficha não encontrada
 */
router.patch('/assignments/:id/finish', verifyToken, assignmentController.finishAssignment);

export default router;
