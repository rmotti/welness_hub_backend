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
    // Novo campo para o ID do criador
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios', // Nome da tabela de usuários
        key: 'id'
      }
    }
  }, {
    tableName: 'treino',
    timestamps: false,
    underscored: true
  });

  // Configuração da associação
  Workout.associate = (models) => {
    Workout.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'criador'
    });
  };

  return Workout;
};