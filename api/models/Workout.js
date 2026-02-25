export default (sequelize, Sequelize) => {
  const Workout = sequelize.define("workout", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_treino: {
      type: Sequelize.STRING,
      allowNull: false
    },
    objetivo_treino: {
      type: Sequelize.STRING
    },
    descricao: {
      type: Sequelize.TEXT
    },
    personal_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'treino',
    timestamps: false,
    underscored: true
  });

  Workout.associate = (models) => {
    Workout.belongsTo(models.User, {
      foreignKey: 'personal_id',
      as: 'criador'
    });
  };

  return Workout;
};