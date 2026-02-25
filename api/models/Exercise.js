export default (sequelize, Sequelize) => {
  const Exercise = sequelize.define("exercise", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false
    },
    grupo_muscular: {
      type: Sequelize.STRING
    },
    descricao: {
      type: Sequelize.TEXT
    }
  }, {
    tableName: 'exercicio',
    timestamps: false,
    underscored: true
  });

  return Exercise;
};