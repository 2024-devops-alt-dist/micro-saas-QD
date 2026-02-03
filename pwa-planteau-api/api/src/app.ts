import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import logger from './middlewares/logger';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { router as healthRouter } from './routes/healthRoutes';
import { router as householdRouter } from './routes/householdRoutes';
import { router as userRouter } from './routes/userRoutes';
import { router as plantRouter } from './routes/plantRoutes';
import { router as tasksRouter } from './routes/tasksRoutes';
import { router as noteRouter } from './routes/noteRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());

// CORS configuration: allow frontend origin to communicate with API
app.use(
  cors({
    origin: config.FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// request logging middleware
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// base path pour les routes API (ex: '/api') — configurable via env
const API_BASE = process.env.API_BASE_PATH || '/api';

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

app.use(`${API_BASE}/health`, healthRouter);
app.use(`${API_BASE}/households`, householdRouter);
app.use(`${API_BASE}/users`, userRouter);
app.use(`${API_BASE}/plants`, plantRouter);
app.use(`${API_BASE}/tasks`, tasksRouter);
app.use(`${API_BASE}/notes`, noteRouter);

app.use(errorHandler);

export default app;
