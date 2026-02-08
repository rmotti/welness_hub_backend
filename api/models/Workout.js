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
    }
  }, {
    tableName: 'TREINO',
    timestamps: false
  });

  return Workout;
};