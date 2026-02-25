import express from 'express';
import workoutController from '../controller/workout.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Gestão de treinos e exercícios dentro do treino
 */

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Lista todos os treinos do personal autenticado
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de treinos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome_treino:
 *                     type: string
 *                   objetivo_treino:
 *                     type: string
 *                   descricao:
 *                     type: string
 *       401:
 *         description: Não autorizado
 */
router.get('/workouts', verifyToken, workoutController.getAll);

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Cria um novo treino
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome_treino]
 *             properties:
 *               nome_treino:
 *                 type: string
 *                 example: Treino A - Peito e Tríceps
 *               objetivo_treino:
 *                 type: string
 *                 example: Hipertrofia
 *               descricao:
 *                 type: string
 *                 example: Foco em volume com descanso curto
 *     responses:
 *       201:
 *         description: Treino criado com sucesso
 *       400:
 *         description: Nome do treino é obrigatório
 *       401:
 *         description: Não autorizado
 */
router.post('/workouts', verifyToken, workoutController.create);

/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Retorna um treino pelo ID
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     responses:
 *       200:
 *         description: Dados do treino
 *       404:
 *         description: Treino não encontrado
 *       401:
 *         description: Não autorizado
 *   put:
 *     summary: Atualiza um treino existente
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_treino:
 *                 type: string
 *               objetivo_treino:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Treino atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Treino não encontrado
 *   delete:
 *     summary: Exclui um treino pelo ID
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     responses:
 *       204:
 *         description: Treino excluído com sucesso
 *       404:
 *         description: Treino não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/workouts/:id', verifyToken, workoutController.getById);
router.put('/workouts/:id', verifyToken, workoutController.update);
router.delete('/workouts/:id', verifyToken, workoutController.remove);

// =============================================================================
// WORKOUT EXERCISES
// =============================================================================

/**
 * @swagger
 * /workouts/{workoutId}/exercises:
 *   get:
 *     summary: Lista os exercícios de um treino
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Treino não encontrado
 */
router.get('/workouts/:workoutId/exercises', verifyToken, workoutController.getExercises);

/**
 * @swagger
 * /workouts/{workoutId}/exercises:
 *   post:
 *     summary: Adiciona um exercício a um treino
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             required: [exercicio_id]
 *             properties:
 *               exercicio_id:
 *                 type: integer
 *                 example: 5
 *               series:
 *                 type: integer
 *                 example: 4
 *               repeticoes:
 *                 type: string
 *                 example: "10-12"
 *               ordem:
 *                 type: integer
 *                 example: 1
 *               descanso_segundos:
 *                 type: integer
 *                 example: 60
 *               observacao_especifica:
 *                 type: string
 *                 example: Cadência controlada na descida
 *     responses:
 *       201:
 *         description: Exercício adicionado ao treino com sucesso
 *       400:
 *         description: ID do exercício é obrigatório
 *       401:
 *         description: Não autorizado
 */
router.post('/workouts/:workoutId/exercises', verifyToken, workoutController.addExercise);

/**
 * @swagger
 * /workouts/{workoutId}/exercises/{exerciseId}:
 *   put:
 *     summary: Atualiza um exercício dentro de um treino
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
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
 *         description: ID do item de exercício no treino
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               series:
 *                 type: integer
 *               repeticoes:
 *                 type: string
 *               ordem:
 *                 type: integer
 *               descanso_segundos:
 *                 type: integer
 *               observacao_especifica:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Item não encontrado
 *   delete:
 *     summary: Remove um exercício de um treino
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
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
 *         description: ID do item de exercício no treino
 *     responses:
 *       200:
 *         description: Exercício removido do treino com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Item não encontrado
 */
router.put('/workouts/:workoutId/exercises/:exerciseId', verifyToken, workoutController.updateExerciseItem);
router.delete('/workouts/:workoutId/exercises/:exerciseId', verifyToken, workoutController.removeExercise);

export default router;
