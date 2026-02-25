import exerciseService from '../services/exercise.service.js';

const createExercise = async (req, res) => {
    const { nome, descricao, grupo_muscular } = req.body;
    try {
        const exercise = await exerciseService.createExercise({ nome, descricao, grupo_muscular });
        return res.status(201).json({ message: 'Exercício criado com sucesso!', exercise });
    } catch (error) {
        console.error("Error creating exercise:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const getExercises = async (req, res) => {
    const filters = req.query;  // Filtros vindos da URL (ex: ?nome=Supino&grupo_muscular=Peito)
    try {
        const exercises = await exerciseService.getAllExercises(filters);
        return res.status(200).json(exercises);
    } catch (error) {
        console.error("Error fetching exercises:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const getExerciseById = async (req, res) => {
    const { id } = req.params;
    try {
        const exercise = await exerciseService.getExerciseById(id);
        return res.status(200).json(exercise);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const updateExercise = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedExercise = await exerciseService.updateExercise(id, data);
        return res.status(200).json({   message: 'Exercício atualizado com sucesso!', exercise: updatedExercise });
    } catch (error) {
        console.error("Error updating exercise:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

const deleteExercise = async (req, res) => {
    const { id } = req.params;
    try {
        await exerciseService.deleteExercise(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Erro Interno do Servidor' });
    }
};

export default {
    createExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
};