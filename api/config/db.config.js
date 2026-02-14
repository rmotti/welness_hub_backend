import dotenv from 'dotenv';
dotenv.config();

const useSSL = process.env.DB_SSL === 'true';

const dbConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  dialect: 'postgres',

  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},

  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 0,
    evict: 8000,
  }
};

export default dbConfig;
