export default (sequelize, Sequelize) => {
  const WorkoutExercise = sequelize.define("workout_exercise", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    treino_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'treino',
        key: 'id'
      }
    },
    exercicio_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'exercicio',
        key: 'id'
      }
    },
    ordem: {
      type: Sequelize.INTEGER
    },
    series: {
      type: Sequelize.INTEGER
    },
    // IMPORTANTE: String para permitir faixas como "10-12" ou "Falha"
    repeticoes: {
      type: Sequelize.STRING
    },
    descanso_segundos: {
      type: Sequelize.INTEGER
    },
    peso: {
      type: Sequelize.DECIMAL(6, 2)
    },
    observacao_especifica: {
      type: Sequelize.TEXT
    }
  }, {
    tableName: 'treino_exercicio',
    timestamps: false,
    underscored: true
  });

  return WorkoutExercise;
};