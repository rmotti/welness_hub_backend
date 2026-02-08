import dbConfig from '../config/db.config.js';
import { Sequelize } from 'sequelize';
import pg from 'pg';

// Importando com os nomes novos
import UserModel from './User.js'; // Assumindo que você manteve User.js ou Usuario.js
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

// Inicializa os Models
db.users = UserModel(sequelize, Sequelize);
db.measurements = MeasurementsModel(sequelize, Sequelize);
db.workouts = WorkoutModel(sequelize, Sequelize);
db.user_workouts = UserWorkoutModel(sequelize, Sequelize);

// --- RELACIONAMENTOS (Associations) ---

// 1. User has many Measurements
db.users.hasMany(db.measurements, { foreignKey: 'usuario_id' });
db.measurements.belongsTo(db.users, { foreignKey: 'usuario_id' });

// 2. User <-> Workout (Many-to-Many via UserWorkout)
db.users.belongsToMany(db.workouts, {
  through: db.user_workouts,
  foreignKey: "usuario_id",
  otherKey: "treino_id"
});

db.workouts.belongsToMany(db.users, {
  through: db.user_workouts,
  foreignKey: "treino_id",
  otherKey: "usuario_id"
});

export default db;