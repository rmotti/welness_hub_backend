import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  dialect: 'postgres',
  
  // --- O SEGREDO ESTÁ NESTE BLOCO ---
  dialectOptions: {
    ssl: {
      require: true,            // Obriga o uso de SSL
      rejectUnauthorized: false // Aceita o certificado do Neon sem burocracia
    }
  },
  // ----------------------------------

  pool: {
    max: 2,
    min: 0,
    acquire: 3000,
    idle: 0,
    evict: 8000, 
  }
};

export default dbConfig;