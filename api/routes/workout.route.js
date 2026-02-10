import controller from "../controllers/workout.controller.js";
import authJwt from "../middleware/authJwt.js"; // Exemplo de middleware

export default function(app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    // Rotas de Treino (Cabeçalho)
    app.post("/api/workouts", [authJwt.verifyToken], controller.create);
    app.get("/api/workouts", [authJwt.verifyToken], controller.getAll);
    app.put("/api/workouts/:id", [authJwt.verifyToken], controller.update);

    // Rotas de Exercícios dentro do Treino
    app.get("/api/workouts/:workoutId/exercises", [authJwt.verifyToken], controller.getExercises);
    app.post("/api/workouts/:workoutId/exercises", [authJwt.verifyToken], controller.addExercise);
    app.put("/api/workouts/:workoutId/exercises/:exerciseId", [authJwt.verifyToken], controller.updateExerciseItem);
    app.delete("/api/workouts/:workoutId/exercises/:exerciseId", [authJwt.verifyToken], controller.removeExercise);
};