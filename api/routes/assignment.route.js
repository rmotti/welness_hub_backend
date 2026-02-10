import assignmentController from "../controller/assignment.controller.js";

export default function(app) {
    app.post('/assignments', assignmentController.assignWorkout);
    app.post('/assignments/workout/:workoutId/exercises', assignmentController.addExerciseToWorkout);
    app.put('/assignments/workout/:workoutId/exercises/:exerciseId', assignmentController.updateWorkoutExercise);
    app.delete('/assignments/workout/:workoutId/exercises/:exerciseId', assignmentController.removeExerciseFromWorkout);
}