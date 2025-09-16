import express from 'express';
import dotenv from 'dotenv'; // charge les variables d'environnement depuis un fichier .env

dotenv.config(); // initialise dotenv pour lire le fichier .env

const app = express(); // crée l'application Express
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000; 

// route de santé simple utilisée par les healthchecks/monitoring
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// route racine pour vérification rapide/manual testing
app.get('/', (_req, res) => res.send('Hello from API'));

// démarre le serveur et écoute sur le port défini
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});