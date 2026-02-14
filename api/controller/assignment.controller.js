import assignmentService from "../services/assignment.service.js";

const assignWorkout = async (req, res) => {
    try {
        const { aluno_id, treino_id, data_inicio, data_fim } = req.body;

        if (!aluno_id || !treino_id) {
            return res.status(400).json({ message: 'aluno_id e treino_id são obrigatórios.' });
        }

        const assignment = await assignmentService.assignWorkoutToUser(aluno_id, treino_id, { data_inicio, data_fim });
        res.status(201).json({ message: 'Treino atribuído com sucesso!', assignment });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getStudentWorkouts = async (req, res) => {
    try {
        const { id } = req.params;
        const workouts = await assignmentService.getStudentWorkouts(id);
        res.status(200).json(workouts);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const finishAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await assignmentService.finishAssignment(id);
        res.status(200).json({ message: 'Ficha finalizada com sucesso!', assignment });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export default {
    assignWorkout,
    getStudentWorkouts,
    finishAssignment
};
