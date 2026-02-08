export default (sequelize, Sequelize) => {
  const UserWorkout = sequelize.define("user_workout", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'USUARIO',
        key: 'id'
      }
    },
    treino_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TREINO',
        key: 'id'
      }
    },
    data_inicio: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    data_fim: {
      type: Sequelize.DATEONLY
    },
    status_treino: {
      type: Sequelize.ENUM('Ativo', 'Finalizado'),
      defaultValue: 'Ativo'
    }
  }, {
    tableName: 'TREINO_ALUNO',
    timestamps: false,
    underscored: true
  });

  return UserWorkout;
};