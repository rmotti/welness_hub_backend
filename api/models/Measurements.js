export default (sequelize, Sequelize) => {
  const Measurements = sequelize.define("measurements", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    peso: { type: Sequelize.DECIMAL(5, 2) },
    altura: { type: Sequelize.DECIMAL(3, 2) },
    bf_percentual: { type: Sequelize.DECIMAL(5, 2) },
    data_medicao: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'MEDIDAS',
    timestamps: true,
    underscored: true
  });

  return Measurements;
};