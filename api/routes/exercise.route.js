import express from 'express';
import exerciseController from '../controller/exercise.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Catálogo de exercícios disponíveis
 */

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Lista todos os exercícios do catálogo
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de exercícios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   grupo_muscular:
 *                     type: string
 *                   descricao:
 *                     type: string
 *       401:
 *         description: Não autorizado
 */
router.get('/exercises', verifyToken, exerciseController.getExercises);

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Cria um novo exercício no catálogo
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Supino Reto
 *               grupo_muscular:
 *                 type: string
 *                 example: Peito
 *               descricao:
 *                 type: string
 *                 example: Exercício de empurrar com barra
 *     responses:
 *       201:
 *         description: Exercício criado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/exercises', verifyToken, exerciseController.createExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Retorna um exercício pelo ID
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exercício
 *     responses:
 *       200:
 *         description: Dados do exercício
 *       404:
 *         description: Exercício não encontrado
 *       401:
 *         description: Não autorizado
 *   put:
 *     summary: Atualiza um exercício do catálogo
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exercício
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               grupo_muscular:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercício atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Exercício não encontrado
 *   delete:
 *     summary: Remove um exercício do catálogo
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exercício
 *     responses:
 *       204:
 *         description: Exercício removido com sucesso
 *       404:
 *         description: Exercício não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/exercises/:id', verifyToken, exerciseController.getExerciseById);
router.put('/exercises/:id', verifyToken, exerciseController.updateExercise);
router.delete('/exercises/:id', verifyToken, exerciseController.deleteExercise);

export default router;
