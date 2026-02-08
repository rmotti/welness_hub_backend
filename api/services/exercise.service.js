import db from '../models/index.js';

const Exercise = db.exercises;
const Op = db.Sequelize.Op;

const createExercise = async ({ nome, descricao, grupo_muscular }) => {
    return await Exercise.create({
        nome,
        descricao,
        grupo_muscular
    });
};

const getAllExercises = async (filters) => {
    const { nome, grupo_muscular } = filters;

    let condition = {};

    if (nome) condition.nome = { [Op.iLike]: `%${nome}%` }; // PostgreSQL
    if (grupo_muscular) condition.grupo_muscular = grupo_muscular;

    return await Exercise.findAll({
        where: condition
    });
};

const updateExercise = async (id, data) => {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw { status: 404, message: 'Exercício não encontrado' };

    await exercise.update(data);
    return await Exercise.findByPk(id);
};

export default {
    createExercise,
    getAllExercises,
    updateExercise
};

