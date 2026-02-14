import db from '../models/index.js';

const Measurement = db.measurements;
const User = db.users;

const getMeasurements = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'Aluno não encontrado.' };

    return await Measurement.findAll({
        where: { usuario_id: userId },
        order: [['data_medicao', 'DESC']]
    });
};

const getLatestMeasurement = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'Aluno não encontrado.' };

    return await Measurement.findOne({
        where: { usuario_id: userId },
        order: [['data_medicao', 'DESC']]
    });
};

const createMeasurement = async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'Aluno não encontrado.' };

    return await Measurement.create({
        usuario_id: userId,
        peso: data.peso,
        altura: data.altura,
        bf_percentual: data.bf_percentual,
        data_medicao: data.data_medicao || new Date()
    });
};

export default {
    getMeasurements,
    getLatestMeasurement,
    createMeasurement
};
