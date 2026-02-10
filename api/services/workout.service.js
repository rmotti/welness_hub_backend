import db from '../models/index.js';

const Workout = db.workouts;
const Exercise = db.exercises;
const WorkoutExercise = db.workout_exercises; // Certifique-se que este é o nome no db object
const Op = db.Sequelize.Op;

// --- Services de Treino (Cabeçalho) ---

const createWorkout = async ({ nome, descricao, personal_id }) => {
    return await Workout.create({
        nome,
        descricao,
        personal_id
    });
};

const getAllWorkouts = async (personalId, filters) => {
    const { nome } = filters;
    let condition = { personal_id: personalId };

    if (nome) condition.nome = { [Op.iLike]: `%${nome}%` };

    return await Workout.findAll({
        where: condition
    });
};

const updateWorkout = async (id, data) => {
    const workout = await Workout.findByPk(id);
    if (!workout) throw { status: 404, message: 'Treino não encontrado' };

    await workout.update(data);
    return await Workout.findByPk(id);
};

// --- Services de Itens do Treino (Exercícios) ---

// GET /workouts/:workoutId/exercises
const getWorkoutExercises = async (workoutId) => {
    // Buscamos diretamente na tabela de junção para ter mais controle sobre a ordem e campos
    const exercises = await WorkoutExercise.findAll({
        where: { treino_id: workoutId },
        include: [
            {
                model: Exercise,
                as: 'exercise', // Necessário definir 'belongsTo' no index.js (ver nota abaixo)
                attributes: ['id', 'nome', 'grupo_muscular', 'video_url'] // Campos que você quer exibir do exercício base
            }
        ],
        order: [['ordem', 'ASC']]
    });
    
    // Se quiser retornar erro 404 caso o treino não tenha exercícios, descomente abaixo. 
    // Mas retornar array vazio [] costuma ser melhor para o front-end.
    // if (!exercises) throw { status: 404, message: 'Nenhum exercício encontrado para este treino' };

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

    // Verificação opcional: checar se o treino existe
    const workout = await Workout.findByPk(workoutId);
    if (!workout) throw { status: 404, message: 'Treino não encontrado' };

    // Cria o vínculo
    return await WorkoutExercise.create({
        treino_id: workoutId,      // FK correta baseada no seu model
        exercicio_id: exercicio_id,// FK correta baseada no seu model
        series,
        repeticoes,            // String (ex: "10-12")
        ordem,
        descanso_segundos,
        observacao_especifica
    });
};

// PUT /workouts/:workoutId/exercises/:exerciseId
// Atualiza os dados da série (reps, descanso) de um exercício específico naquele treino
const updateWorkoutExercise = async (workoutId, exerciseId, data) => {
    const item = await WorkoutExercise.findOne({
        where: {
            treino_id: workoutId,
            exercicio_id: exerciseId
        }
    });

    if (!item) throw { status: 404, message: 'Exercício não encontrado neste treino' };

    // Atualizamos apenas os campos permitidos na tabela de junção
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