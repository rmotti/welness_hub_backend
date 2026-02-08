import dbConfig from '../config/db.config.js';
import { Sequelize } from 'sequelize';
import User from './User.js';
import pg from 'pg';

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    dialectModule: pg, // Corrigido (estava 'dialecctModule')

    logging: false,


    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },


    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
      evict: dbConfig.pool.evict
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = User(sequelize, Sequelize);

export default db;