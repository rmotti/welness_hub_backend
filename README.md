# Wellness Hub API

API REST para gestao de treinos, alunos e evolucao corporal voltada para Personal Trainers.

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Banco:** PostgreSQL (Neon / Local)
- **ORM:** Sequelize 6
- **Auth:** JWT + bcrypt
- **Docs:** Swagger UI (swagger-jsdoc)
- **Infra:** Docker + Docker Compose

## Endpoints

| Grupo | Rota | Metodo | Descricao |
|---|---|---|---|
| **Auth** | `/auth/register` | POST | Registrar usuario |
| | `/auth/login` | POST | Login (retorna JWT) |
| | `/auth/me` | GET | Dados do usuario logado |
| | `/auth/me` | PUT | Atualizar perfil |
| **Dashboard** | `/dashboard/stats` | GET | KPIs (alunos, treinos ativos, medidas pendentes) |
| **Alunos** | `/students` | GET | Listar alunos do personal |
| | `/students` | POST | Cadastrar aluno |
| | `/students/:id` | PUT | Editar aluno |
| | `/students/:id` | DELETE | Inativar aluno (soft delete) |
| **Medidas** | `/students/:id/measurements` | GET | Historico de medidas |
| | `/students/:id/measurements/latest` | GET | Ultima medida |
| | `/students/:id/measurements` | POST | Nova avaliacao |
| **Exercicios** | `/exercises` | GET | Listar catalogo |
| | `/exercises` | POST | Cadastrar exercicio |
| | `/exercises/:id` | PUT | Editar exercicio |
| **Treinos** | `/workouts` | GET | Listar templates de treino |
| | `/workouts` | POST | Criar treino |
| | `/workouts/:id` | PUT | Editar treino |
| **Montagem** | `/workouts/:workoutId/exercises` | GET | Exercicios do treino |
| | `/workouts/:workoutId/exercises` | POST | Adicionar exercicio ao treino |
| | `/workouts/:workoutId/exercises/:exerciseId` | PUT | Editar series/reps |
| | `/workouts/:workoutId/exercises/:exerciseId` | DELETE | Remover exercicio do treino |
| **Atribuicoes** | `/students/:id/workouts` | GET | Fichas do aluno |
| | `/assignments` | POST | Vincular treino a aluno |
| | `/assignments/:id/finish` | PATCH | Finalizar ficha |

Documentacao interativa completa em `/api-docs` (Swagger UI).

## Estrutura do Projeto

```
api/
├── config/
│   └── db.config.js
├── controller/
│   ├── user.controller.js
│   ├── exercise.controller.js
│   ├── workout.controller.js
│   ├── assignment.controller.js
│   └── measurement.controller.js
├── middleware/
│   └── jwt.token.middleware.js
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Workout.js
│   ├── Exercise.js
│   ├── WorkoutExercise.js
│   ├── UserWorkout.js
│   └── Measurements.js
├── routes/
│   └── index.js                # Todas as rotas centralizadas + Swagger
├── services/
│   ├── user.service.js
│   ├── exercise.service.js
│   ├── workout.service.js
│   ├── assignment.service.js
│   └── measurement.service.js
└── index.js                    # Entry point
```

## Setup

### Variaveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
PORT=3001
JWT_SECRET=sua_chave_secreta

POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_PORT=5432
POSTGRES_DATABASE=wellness_hub

# true para Neon/cloud, false para Postgres local
DB_SSL=false
```

Para gerar uma chave JWT segura:

```bash
npm run generate-secret-key
```

### Rodar Local (sem Docker)

```bash
npm install
npm run start-app
```

### Rodar com Docker

```bash
docker compose up --build -d
```

| Servico | URL |
|---|---|
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/api-docs |
| PgAdmin | http://localhost:5050 |

```bash
# Ver logs
docker compose logs -f api

# Parar
docker compose down
```

## Autenticacao

A API usa JWT Bearer Token:

1. `POST /auth/login` com email e senha
2. Copiar o `token` da resposta
3. Enviar no header de todas as requisicoes protegidas:

```
Authorization: Bearer <token>
```

No Swagger UI, clicar em **Authorize** no topo e colar o token.

## Scripts

| Script | Descricao |
|---|---|
| `npm run start-app` | Inicia com hot reload (nodemon) |
| `npm run start-database` | Sobe containers Docker |
| `npm run stop-database` | Para containers Docker |
| `npm run generate-secret-key` | Gera chave JWT aleatoria |
