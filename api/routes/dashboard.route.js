import express from 'express';
import userController from '../controller/user.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: KPIs e estatísticas do personal
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Retorna as estatísticas do dashboard do personal autenticado
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_alunos:
 *                   type: integer
 *                   example: 12
 *                 alunos_ativos:
 *                   type: integer
 *                   example: 10
 *                 total_treinos:
 *                   type: integer
 *                   example: 25
 *                 fichas_ativas:
 *                   type: integer
 *                   example: 18
 *       401:
 *         description: Não autorizado
 */
router.get('/dashboard/stats', verifyToken, userController.getDashboard);

export default router;
