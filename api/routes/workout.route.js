import controller from "../controller/workout.controller.js";
import verifyToken from '../middleware/jwt.token.middleware.js'; // Importando o middleware

export default function(app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    // Rotas de Treino (Cabeçalho)
    app.post("/api/workouts", [verifyToken], controller.create);
    app.get("/api/workouts", [verifyToken], controller.getAll);
    app.put("/api/workouts/:id", [verifyToken], controller.update);

    // Rotas de Exercícios dentro do Treino
    app.get("/api/workouts/:workoutId/exercises", [verifyToken], controller.getExercises);
    app.post("/api/workouts/:workoutId/exercises", [verifyToken], controller.addExercise);
    app.put("/api/workouts/:workoutId/exercises/:exerciseId", [verifyToken], controller.updateExerciseItem);
    app.delete("/api/workouts/:workoutId/exercises/:exerciseId", [verifyToken], controller.removeExercise);
};