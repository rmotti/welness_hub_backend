import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const User = db.users;
const Workout = db.workouts;
const Exercise = db.exercises;
const Assignment = db.user_workouts;
const Op = db.Sequelize.Op;

const assignWorkoutToUser = async (userId, workoutId) => {
    // Verificar se o usuário existe
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'Usuário não encontrado.' };
    // Verificar se o treino existe
    const workout = await Workout.findByPk(workoutId);
    if (!workout) throw { status: 404, message: 'Treino não encontrado.' };
    // Verificar se o treino já está atribuído ao usuário
    const existingAssignment = await Assignment.findOne({ where: { user_id: userId, treino_id: workoutId } });
    if (existingAssignment) throw { status: 409, message: 'Treino já atribuído a este usuário.' };

    return await Assignment.create({
        user_id: userId,
        treino_id: workoutId
    });
};


const addExerciseToWorkout = async (workoutId, data) => {
    const { exercicio_id, series, repeticoes, ordem, descanso_segundos, observacao_especifica } = data;
    // Verificação opcional: checar se o treino existe
    const workout = await Workout.findByPk(workoutId);
    if (!workout) throw { status: 404, message: 'Treino não encontrado' };
    // Cria o vínculo
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
        observacao_especifica: data.observacao_especifica,
        status: data.status
    });
    return item;
};

const removeExerciseFromWorkout = async (workoutId, exerciseId) => {
    const item = await WorkoutExercise.findOne({
        where: {
            treino_id: workoutId,
            exercicio_id: exerciseId
        }
    });
    if (!item) throw { status: 404, message: 'Exercício não encontrado neste treino' };
    await item.destroy();
    return { message: 'Exercício removido do treino com sucesso.' };
};

export default {
    assignWorkoutToUser,
    addExerciseToWorkout,
    updateWorkoutExercise,
    removeExerciseFromWorkout
};