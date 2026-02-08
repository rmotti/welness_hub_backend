import express from 'express';
import db from './models/index.js';
import path from 'path';
import { fileURLToPath } from 'url'; // <--- 1. IMPORTAR ISTO
import userRoute from './routes/user.route.js';
import exampleRoute from './routes/example.route.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// 2. CONFIGURAR __dirname (Necessário em ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

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
        url: 'http://localhost:3000',
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
  // 3. CORREÇÃO DO CAMINHO: Usar __dirname garante que ele olhe a pasta ao lado do index.js
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Debug para confirmar se funcionou
console.log("DEBUG SWAGGER:", JSON.stringify(swaggerDocs.paths, null, 2));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- RESTO DO CÓDIGO ---
db.sequelize.sync()
    .then(() => {
        console.log("Database synced successfully.");
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });

app.use("/users", userRoute);
app.use("/secureExampleRoute", exampleRoute);

app.get('/', (req, res) => {
    res.send({message:'API Started'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server is running on port http://localhost:${PORT}/`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});