import workoutService from '../services/workout.service.js';

// --- Controllers de Treino (Cabeçalho) ---

const create = async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        const personal_id = req.userId; // Vem do middleware de auth

        if (!nome) {
            return res.status(400).send({ message: "O nome do treino é obrigatório." });
        }

        const workout = await workoutService.createWorkout({
            nome,
            descricao,
            personal_id
        });

        res.status(201).send(workout);
    } catch (error) {
        res.status(500).send({ message: error.message || "Erro ao criar treino." });
    }
};

const getAll = async (req, res) => {
    try {
        const personal_id = req.userId; // Garante que só busca treinos deste personal
        const filters = req.query; // Pega filtros da URL (ex: ?nome=Hipertrofia)

        const workouts = await workoutService.getAllWorkouts(personal_id, filters);
        
        res.status(200).send(workouts);
    } catch (error) {
        res.status(500).send({ message: error.message || "Erro ao listar treinos." });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Opcional: Validar se o treino pertence ao personal antes de editar
        // (Isso geralmente é feito no service ou aqui verificando o dono)
        
        const updatedWorkout = await workoutService.updateWorkout(id, req.body);
        res.status(200).send(updatedWorkout);
    } catch (error) {
        if (error.status) {
            res.status(error.status).send({ message: error.message });
        } else {
            res.status(500).send({ message: "Erro ao atualizar treino." });
        }
    }
};

// --- Controllers de Itens do Treino (Exercícios) ---

const getExercises = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        
        const exercises = await workoutService.getWorkoutExercises(workoutId);
        
        res.status(200).send(exercises);
    } catch (error) {
        if (error.status) {
            res.status(error.status).send({ message: error.message });
        } else {
            res.status(500).send({ message: "Erro ao buscar exercícios do treino." });
        }
    }
};

const addExercise = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const { 
            exercicio_id, 
            series, 
            repeticoes, 
            ordem, 
            descanso_segundos,
            observacao_especifica
        } = req.body;

        if (!exercicio_id) {
            return res.status(400).send({ message: "ID do exercício é obrigatório." });
        }

        const newExerciseItem = await workoutService.addExerciseToWorkout(workoutId, {
            exercicio_id,
            series,
            repeticoes,
            ordem,
            descanso_segundos,
            observacao_especifica
        });

        res.status(201).send(newExerciseItem);
    } catch (error) {
        if (error.status) {
            res.status(error.status).send({ message: error.message });
        } else {
            res.status(500).send({ message: "Erro ao adicionar exercício ao treino." });
        }
    }
};

const updateExerciseItem = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const exerciseId = req.params.exerciseId;
        const data = req.body;

        const updatedItem = await workoutService.updateWorkoutExercise(workoutId, exerciseId, data);
        
        res.status(200).send(updatedItem);
    } catch (error) {
        if (error.status) {
            res.status(error.status).send({ message: error.message });
        } else {
            res.status(500).send({ message: "Erro ao atualizar item do treino." });
        }
    }
};

const removeExercise = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const exerciseId = req.params.exerciseId;

        const result = await workoutService.removeExerciseFromWorkout(workoutId, exerciseId);
        
        res.status(200).send(result);
    } catch (error) {
        if (error.status) {
            res.status(error.status).send({ message: error.message });
        } else {
            res.status(500).send({ message: "Erro ao remover exercício do treino." });
        }
    }
};

export default {
    create,
    getAll,
    update,
    getExercises,
    addExercise,
    updateExerciseItem,
    removeExercise
};