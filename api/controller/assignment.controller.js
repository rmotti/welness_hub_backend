import assignmentService from "../services/assignment.service.js";

const assignWorkout = async (req, res) => {
    try {
        const userId = req.body.userId;
        const workoutId = req.body.workoutId;

        const assignment = await assignmentService.assignWorkoutToUser(userId, workoutId);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const addExerciseToWorkout = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const data = req.body;

        const newExerciseItem = await assignmentService.addExerciseToWorkout(workoutId, data);
        res.status(201).json(newExerciseItem);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const updateWorkoutExercise = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const exerciseId = req.params.exerciseId;
        const data = req.body;

        const updatedItem = await assignmentService.updateWorkoutExercise(workoutId, exerciseId, data);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const removeExerciseFromWorkout = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const exerciseId = req.params.exerciseId;

        const result = await assignmentService.removeExerciseFromWorkout(workoutId, exerciseId);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export default {
    assignWorkout,
    addExerciseToWorkout,
    updateWorkoutExercise,
    removeExerciseFromWorkout
};

