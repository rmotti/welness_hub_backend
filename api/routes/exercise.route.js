import express from 'express';
import exerciseController from '../controller/exercise.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js'; 
const router = express.Router();

router.post('/', [verifyToken], exerciseController.createExercise);
router.get('/', [verifyToken], exerciseController.getExercises);
router.put('/:id', [verifyToken], exerciseController.updateExercise);

export default router;