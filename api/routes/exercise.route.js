import express from 'express';
import exerciseController from '../controller/exercise.controller.js';

const router = express.Router();

router.post('/', exerciseController.createExercise);
router.get('/', exerciseController.getExercises);
router.put('/:id', exerciseController.updateExercise);

export default router;