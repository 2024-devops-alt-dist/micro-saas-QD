import express from 'express';
import dotenv from 'dotenv'; // charge les variables d'environnement depuis un fichier .env
import { Pool } from 'pg';

dotenv.config(); // initialise dotenv pour lire le fichier .env

const app = express(); // crée l'application Express
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;

// base path pour les routes API (ex: '/api') — configurable via env
const API_BASE = process.env.API_BASE_PATH || '/api';

// initialisation du pool PostgreSQL 
const pool = new Pool({ connectionString: process.env.DATABASE_URL });


// endpoint GET /api/health -> teste la connexion à la BDD
app.get(`${API_BASE}/health`, async (_req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }

    const client = await pool.connect();
    try {
      // exécution d'une requête très simple pour tester la connexion
      await client.query('SELECT 1');
      return res.json({ status: 'ok', message: 'API connected to database!' });
    } finally {
      client.release();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Database connection error:', err);
    return res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// route racine pour vérification rapide/manual testing
app.get('/', (_req, res) => res.send('Hello from API'));

// démarre le serveur et écoute sur le port défini
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});