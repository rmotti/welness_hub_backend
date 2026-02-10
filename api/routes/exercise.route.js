import express from 'express';
import exerciseController from '../controller/exercise.controller.js';
import authJwt from '../middleware/authJwt.js'; 
const router = express.Router();

router.post('/', [authJwt.verifyToken], exerciseController.createExercise);
router.get('/', [authJwt.verifyToken], exerciseController.getExercises);
router.put('/:id', [authJwt.verifyToken], exerciseController.updateExercise);

export default router;