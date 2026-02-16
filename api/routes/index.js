import express from 'express';
import verifyToken from '../middleware/jwt.token.middleware.js';
import userController from '../controller/user.controller.js';
import exerciseController from '../controller/exercise.controller.js';
import workoutController from '../controller/workout.controller.js';
import assignmentController from '../controller/assignment.controller.js';
import measurementController from '../controller/measurement.controller.js';

const router = express.Router();


router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.get('/auth/me', verifyToken, userController.getMe);
router.put('/auth/me', verifyToken, userController.updateMe);

// =============================================================================
// 2. DASHBOARD (/dashboard)
// =============================================================================

router.get('/dashboard/stats', verifyToken, userController.getDashboard);

// =============================================================================
// 3. GESTÃO DE ALUNOS (/students)
// =============================================================================

router.get('/students', verifyToken, userController.getAllStudents);
router.get('/students/:id', verifyToken, userController.getStudentById);
router.post('/students', verifyToken, userController.createStudent);
router.put('/students/:id', verifyToken, userController.updateUser);
router.delete('/students/:id', verifyToken, userController.deleteUser);

// =============================================================================
// 4. MEDIDAS & EVOLUÇÃO (/students/:id/measurements)
// =============================================================================

router.get('/students/:id/measurements', verifyToken, measurementController.getMeasurements);
router.get('/students/:id/measurements/latest', verifyToken, measurementController.getLatestMeasurement);
router.post('/students/:id/measurements', verifyToken, measurementController.createMeasurement);

// =============================================================================
// 5. CATÁLOGO DE EXERCÍCIOS (/exercises)
// =============================================================================

router.get('/exercises', verifyToken, exerciseController.getExercises);
router.post('/exercises', verifyToken, exerciseController.createExercise);
router.put('/exercises/:id', verifyToken, exerciseController.updateExercise);

// =============================================================================
// 6. GESTÃO DE TREINOS - TEMPLATES (/workouts)
// =============================================================================


router.get('/workouts', verifyToken, workoutController.getAll);
router.post('/workouts', verifyToken, workoutController.create);
router.put('/workouts/:id', verifyToken, workoutController.update);

// =============================================================================
// 7. MONTAGEM DO TREINO - EXERCÍCIOS (/workouts/:workoutId/exercises)
// =============================================================================

router.get('/workouts/:workoutId/exercises', verifyToken, workoutController.getExercises);
router.post('/workouts/:workoutId/exercises', verifyToken, workoutController.addExercise);
router.put('/workouts/:workoutId/exercises/:exerciseId', verifyToken, workoutController.updateExerciseItem);
router.delete('/workouts/:workoutId/exercises/:exerciseId', verifyToken, workoutController.removeExercise);

// =============================================================================
// 8. ATRIBUIÇÃO - FICHAS DO ALUNO (/assignments, /students/:id/workouts)
// =============================================================================

router.get('/students/:id/workouts', verifyToken, assignmentController.getStudentWorkouts);
router.post('/assignments', verifyToken, assignmentController.assignWorkout);
router.patch('/assignments/:id/finish', verifyToken, assignmentController.finishAssignment);

export default router;
