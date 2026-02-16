import db from '../models/index.js';

const Workout = db.workouts;
const Exercise = db.exercises;
const WorkoutExercise = db.workout_exercises; 
const Op = db.Sequelize.Op;

// --- Services de Treino (Cabeçalho) ---

const createWorkout = async ({ nome_treino, objetivo_treino, descricao, personal_id }) => {
    // CORREÇÃO: Usando os nomes exatos das colunas do banco
    return await Workout.create({
        nome_treino,
        objetivo_treino,
        descricao,
        personal_id
    });
};

const getAllWorkouts = async (personalId, filters) => {
    // CORREÇÃO: O filtro deve buscar pelo campo 'nome_treino'
    const { nome_treino } = filters;
    let condition = { personal_id: personalId };

    // Se o filtro vier preenchido, fazemos o ILIKE no campo correto
    if (nome_treino) {
        condition.nome_treino = { [Op.iLike]: `%${nome_treino}%` };
    }

    return await Workout.findAll({
        where: condition
    });
};

const updateWorkout = async (id, data) => {
    const workout = await Workout.findByPk(id);
    if (!workout) throw { status: 404, message: 'Treino não encontrado' };

    // O 'data' já deve vir com chaves corretas (nome_treino, etc) do controller
    await workout.update(data);
    return await Workout.findByPk(id);
};

// --- Services de Itens do Treino (Exercícios) ---

// GET /workouts/:workoutId/exercises
const getWorkoutExercises = async (workoutId) => {
    const exercises = await WorkoutExercise.findAll({
        where: { treino_id: workoutId },
        include: [
            {
                model: Exercise,
                as: 'exercise', // IMPORTANTE: Verifique se no seu index.js a associação está como 'exercise' ou 'Exercise'
                attributes: ['id', 'nome', 'grupo_muscular', 'video_url'] 
            }
        ],
        order: [['ordem', 'ASC']]
    });
    
    return exercises;
};

// POST /workouts/:workoutId/exercises
const addExerciseToWorkout = async (workoutId, data) => {
    const { 
        exercicio_id, 
        series, 
        repeticoes, 
        ordem, 
        descanso_segundos,
        observacao_especifica 
    } = data;

    const workout = await Workout.findByPk(workoutId);
    if (!workout) throw { status: 404, message: 'Treino não encontrado' };

    return await WorkoutExercise.create({
        treino_id: workoutId,      
        exercicio_id: exercicio_id,
        series,
        repeticoes,            
        ordem,
        descanso_segundos,
        observacao_especifica
    });
};

// PUT /workouts/:workoutId/exercises/:exerciseId
const updateWorkoutExercise = async (workoutId, exerciseId, data) => {
    // Busca o item específico na tabela de ligação
    const item = await WorkoutExercise.findOne({
        where: {
            treino_id: workoutId,
            exercicio_id: exerciseId
        }
    });

    if (!item) throw { status: 404, message: 'Exercício não encontrado neste treino' };

    // Atualiza com os dados recebidos
    await item.update({
        series: data.series,
        repeticoes: data.repeticoes,
        ordem: data.ordem,
        descanso_segundos: data.descanso_segundos,
        observacao_especifica: data.observacao_especifica
    });

    return item;
};

// DELETE /workouts/:workoutId/exercises/:exerciseId
const removeExerciseFromWorkout = async (workoutId, exerciseId) => {
    const result = await WorkoutExercise.destroy({
        where: {
            treino_id: workoutId,
            exercicio_id: exerciseId
        }
    });

    if (!result) throw { status: 404, message: 'Exercício não encontrado neste treino' };
    
    return { message: 'Exercício removido do treino com sucesso' };
};

export default {
    createWorkout,
    getAllWorkouts,
    updateWorkout,
    getWorkoutExercises,
    addExerciseToWorkout,
    updateWorkoutExercise,
    removeExerciseFromWorkout
};