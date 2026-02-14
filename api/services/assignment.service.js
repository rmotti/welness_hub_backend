import db from '../models/index.js';

const User = db.users;
const Workout = db.workouts;
const Assignment = db.user_workouts;

const assignWorkoutToUser = async (alunoId, treinoId, data = {}) => {
    const user = await User.findByPk(alunoId);
    if (!user) throw { status: 404, message: 'Aluno não encontrado.' };

    const workout = await Workout.findByPk(treinoId);
    if (!workout) throw { status: 404, message: 'Treino não encontrado.' };

    const existingAssignment = await Assignment.findOne({
        where: { usuario_id: alunoId, treino_id: treinoId, status_treino: 'Ativo' }
    });
    if (existingAssignment) throw { status: 409, message: 'Este treino já está ativo para este aluno.' };

    return await Assignment.create({
        usuario_id: alunoId,
        treino_id: treinoId,
        data_inicio: data.data_inicio || new Date(),
        data_fim: data.data_fim || null
    });
};

const getStudentWorkouts = async (studentId) => {
    const user = await User.findByPk(studentId);
    if (!user) throw { status: 404, message: 'Aluno não encontrado.' };

    return await Assignment.findAll({
        where: { usuario_id: studentId },
        include: [{
            model: Workout,
            as: 'treino',
            attributes: ['id', 'nome_treino', 'objetivo_treino', 'descricao']
        }],
        order: [['data_inicio', 'DESC']]
    });
};

const finishAssignment = async (assignmentId) => {
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) throw { status: 404, message: 'Atribuição não encontrada.' };

    if (assignment.status_treino === 'Finalizado') {
        throw { status: 400, message: 'Esta ficha já está finalizada.' };
    }

    await assignment.update({
        status_treino: 'Finalizado',
        data_fim: new Date()
    });

    return assignment;
};

export default {
    assignWorkoutToUser,
    getStudentWorkouts,
    finishAssignment
};
