import dbConfig from '../config/db.config.js';
import { Sequelize } from 'sequelize';
import pg from 'pg';

// --- IMPORTAÇÃO DOS MODELOS ---
import UserModel from './User.js';
import MeasurementsModel from './Measurements.js';
import WorkoutModel from './Workout.js';
import UserWorkoutModel from './UserWorkout.js';
// [NOVO] Importando os modelos que faltavam
import ExerciseModel from './Exercise.js';
import WorkoutExerciseModel from './WorkoutExercise.js';

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  dialectModule: pg,
  logging: false, // Pode mudar para console.log se quiser ver o SQL no terminal
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  pool: { ...dbConfig.pool }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- INICIALIZAÇÃO DOS MODELS ---
db.users = UserModel(sequelize, Sequelize);
db.measurements = MeasurementsModel(sequelize, Sequelize);
db.workouts = WorkoutModel(sequelize, Sequelize);
db.user_workouts = UserWorkoutModel(sequelize, Sequelize);

// [NOVO] Inicializando Exercícios e a Pivô
db.exercises = ExerciseModel(sequelize, Sequelize);
db.workout_exercises = WorkoutExerciseModel(sequelize, Sequelize);

// --- RELACIONAMENTOS (Associations) ---

// 1. Hierarquia (Personal tem N Alunos)
db.users.hasMany(db.users, { 
    as: 'alunos', 
    foreignKey: 'personal_id' 
});
db.users.belongsTo(db.users, { 
    as: 'personal', 
    foreignKey: 'personal_id' 
});

// 2. Aluno tem Medidas
db.users.hasMany(db.measurements, { foreignKey: 'usuario_id', as: 'historico_medidas' });
db.measurements.belongsTo(db.users, { foreignKey: 'usuario_id', as: 'aluno' });

// 3. Aluno realiza Treinos (N:N via Tabela Pivot UserWorkout)
db.users.belongsToMany(db.workouts, {
  through: db.user_workouts,
  foreignKey: "usuario_id",
  otherKey: "treino_id",
  as: "meus_treinos"
});

db.workouts.belongsToMany(db.users, {
  through: db.user_workouts,
  foreignKey: "treino_id",
  otherKey: "usuario_id",
  as: "alunos_praticantes"
});

// [NOVO] 4. Treino é composto por Exercícios (N:N via Tabela Pivot WorkoutExercise)
// Essa é a relação mais importante para montar a ficha!
db.workouts.belongsToMany(db.exercises, {
  through: db.workout_exercises,
  foreignKey: "treino_id",
  otherKey: "exercicio_id",
  as: "lista_exercicios" // Ex: treino.getListaExercicios()
});

db.exercises.belongsToMany(db.workouts, {
  through: db.workout_exercises,
  foreignKey: "exercicio_id",
  otherKey: "treino_id",
  as: "treinos_que_usam"
});

// [OPCIONAL E RECOMENDADO] 
// Relacionamentos diretos com a tabela Pivô para facilitar queries complexas.
// Isso ajuda se você quiser buscar "todas as séries e reps do treino X" sem usar o belongsToMany.
db.workouts.hasMany(db.workout_exercises, { foreignKey: "treino_id" });
db.workout_exercises.belongsTo(db.workouts, { foreignKey: "treino_id" });

db.exercises.hasMany(db.workout_exercises, { foreignKey: "exercicio_id" });
db.workout_exercises.belongsTo(db.exercises, { foreignKey: "exercicio_id" });

// 5. Associações diretas da tabela Pivot UserWorkout (para includes em queries)
db.user_workouts.belongsTo(db.workouts, { foreignKey: 'treino_id', as: 'treino' });
db.user_workouts.belongsTo(db.users, { foreignKey: 'usuario_id', as: 'aluno' });

export default db;