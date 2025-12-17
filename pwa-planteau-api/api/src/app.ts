import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger';
import { router as healthRouter } from './routes/healthRoutes';

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

app.use(API_BASE, healthRouter);

export default app;
