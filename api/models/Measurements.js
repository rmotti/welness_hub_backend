export default (sequelize, Sequelize) => {
  const Measurements = sequelize.define("measurements", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    peso: { 
      type: Sequelize.DECIMAL(5, 2) 
    },
    altura: { 
      type: Sequelize.DECIMAL(3, 2) 
    },
    bf_percentual: { 
      type: Sequelize.DECIMAL(4, 2) // Ajustado para 4,2 conforme o SQL (max 99.99%)
    },
    data_medicao: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW // Ótima adição!
    },
    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {         // Boa prática: explicitar a FK aqui também
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    tableName: 'medidas',
    timestamps: false, // IMPORTANTE: O SQL não tem created_at/updated_at
    underscored: true
  });

  return Measurements;
};