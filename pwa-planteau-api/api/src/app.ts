import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger';
import { router as healthRouter } from './routes/healthRoutes';
import { router as householdRouter } from './routes/householdRoutes';
import { router as userRouter } from './routes/userRoutes';
import { router as plantRouter } from './routes/plantRoutes';
import { router as tasksRouter } from './routes/tasksRoutes';
import { router as noteRouter } from './routes/noteRoutes';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
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

app.use(`${API_BASE}/health`, healthRouter);
app.use(`${API_BASE}/households`, householdRouter);
app.use(`${API_BASE}/users`, userRouter);
app.use(`${API_BASE}/plants`, plantRouter);
app.use(`${API_BASE}/tasks`, tasksRouter);
app.use(`${API_BASE}/notes`, noteRouter);

export default app;
