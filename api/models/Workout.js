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
    }
  }, {
    tableName: 'treino',
    timestamps: false, // Sem created_at/updated_at no SQL
    underscored: true
  });

  return Workout;
};