export default (sequelize, Sequelize) => {
  const Measurements = sequelize.define("measurements", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    peso: { // Mantive o nome da coluna em PT pois está assim no banco
      type: Sequelize.DECIMAL(5, 2)
    },
    altura: {
      type: Sequelize.DECIMAL(3, 2)
    },
    bf_percentual: {
      type: Sequelize.DECIMAL(5, 2)
    },
    data_medicao: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'MEDIDAS_ALUNOS', // Mapeia para a tabela existente
    timestamps: false
  });

  return Measurements;
};