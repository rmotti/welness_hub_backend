import express from 'express';
import cors from 'cors';
import db from './models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- SWAGGER CONFIG ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wellness Hub API',
      version: '1.0.0',
      description: 'Documentação da API de gestão de treinos e alunos',
      contact: {
        name: 'Suporte Wellness Hub',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', 'index.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- DATABASE SYNC ---
db.sequelize.sync()
    .then(() => {
        console.log("Database synced successfully.");
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });

// --- ROTAS CENTRALIZADAS ---
app.use(routes);

app.get('/', (req, res) => {
    res.send({ message: 'API Started' });
});

// --- SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server is running on port http://localhost:${PORT}/`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
