import dbConfig from '../config/db.config.js'; // Ajuste o caminho se necessário
import { Sequelize } from 'sequelize';
import pg from 'pg';

import UserModel from './User.js';
import MeasurementsModel from './Measurements.js';
import WorkoutModel from './Workout.js';
import UserWorkoutModel from './UserWorkout.js';

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  pool: { ...dbConfig.pool }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Inicializa Models
db.users = UserModel(sequelize, Sequelize);
db.measurements = MeasurementsModel(sequelize, Sequelize);
db.workouts = WorkoutModel(sequelize, Sequelize);
db.user_workouts = UserWorkoutModel(sequelize, Sequelize);

// --- RELACIONAMENTOS (Associations) ---

// 1. Hierarquia (Personal tem N Alunos)
db.users.hasMany(db.users, { 
    as: 'alunos',        // Permite fazer: personal.getAlunos()
    foreignKey: 'personal_id' 
});
db.users.belongsTo(db.users, { 
    as: 'personal',      // Permite fazer: aluno.getPersonal()
    foreignKey: 'personal_id' 
});

// 2. Aluno tem Medidas
db.users.hasMany(db.measurements, { foreignKey: 'usuario_id' });
db.measurements.belongsTo(db.users, { foreignKey: 'usuario_id' });

// 3. Aluno realiza Treinos (N:N via Tabela Pivot)
db.users.belongsToMany(db.workouts, {
  through: db.user_workouts,
  foreignKey: "usuario_id",
  otherKey: "treino_id",
  as: "meus_treinos"
});

db.workouts.belongsToMany(db.users, {
  through: db.user_workouts,
  foreignKey: "treino_id",
  otherKey: "usuario_id"
});

export default db;