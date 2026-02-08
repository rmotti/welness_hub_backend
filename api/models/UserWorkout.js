export default (sequelize, Sequelize) => {
  const UserWorkout = sequelize.define("user_workout", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data_inicio: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    status_treino: {
      type: Sequelize.ENUM('Ativo', 'Finalizado'),
      defaultValue: 'Ativo'
    },
    usuario_id: {
      type: Sequelize.INTEGER
    },
    treino_id: {
      type: Sequelize.INTEGER
    }
  }, {
    tableName: 'TREINO_ALUNO',
    timestamps: false
  });

  return UserWorkout;
};