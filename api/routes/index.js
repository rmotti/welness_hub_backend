import express from 'express';
import userRoutes from './user.route.js';
import exerciseRoutes from './exercise.route.js';
import workoutRoutes from './workout.route.js';
import assignmentRoutes from './assignment.route.js';
import dashboardRoutes from './dashboard.route.js';

const router = express.Router();

router.use(userRoutes);
router.use(exerciseRoutes);
router.use(workoutRoutes);
router.use(assignmentRoutes);
router.use(dashboardRoutes);

export default router;
