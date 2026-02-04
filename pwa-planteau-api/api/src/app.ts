import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import logger from './middlewares/logger';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { router as healthRouter } from './routes/healthRoutes';
import { router as authRouter } from './routes/authRoutes';
import { router as householdRouter } from './routes/householdRoutes';
import { router as userRouter } from './routes/userRoutes';
import { router as plantRouter } from './routes/plantRoutes';
import { router as tasksRouter } from './routes/tasksRoutes';
import { router as noteRouter } from './routes/noteRoutes';
import { errorHandler } from './middlewares/errorHandler';
import authMiddleware from './middlewares/authMiddleware';

const app = express();
app.use(express.json());
app.use(cookieParser());

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
app.use('/swagger', swaggerUi.serve);
app.get('/swagger', swaggerUi.setup(swaggerSpec));

// Routes publiques (pas d'authentification)
app.use(`${API_BASE}/health`, healthRouter);
app.use(`${API_BASE}/auth`, authRouter);

// Routes protégées par authentification
app.use(`${API_BASE}/households`, authMiddleware, householdRouter);
app.use(`${API_BASE}/users`, authMiddleware, userRouter);
app.use(`${API_BASE}/plants`, authMiddleware, plantRouter);
app.use(`${API_BASE}/tasks`, authMiddleware, tasksRouter);
app.use(`${API_BASE}/notes`, authMiddleware, noteRouter);

app.use(errorHandler);

export default app;
