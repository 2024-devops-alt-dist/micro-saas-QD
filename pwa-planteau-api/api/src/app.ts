import express from 'express';
//import cors from 'cors';
import logger from './middlewares/logger'

const app = express(); // crée l'application Express
app.use(express.json())
//app.use(cors())

// request logging middleware
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.url}`)
  next()
})

// base path pour les routes API (ex: '/api') — configurable via env
const API_BASE = process.env.API_BASE_PATH || '/api';

// endpoint GET /api/health 
app.get(`${API_BASE}/health`, async (_req, res) => {

    const dbConnected = true; // Simule la vérification de la connexion à la BDD
    if (dbConnected) {
        logger.info('Health check succeeded');
       res.status(200).json({ status: 'ok', message: 'API connected to database!' });
    } else {
        logger.error('Health check failed');
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

export default app;