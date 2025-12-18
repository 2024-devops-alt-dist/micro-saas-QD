import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { closeDbConnection, testDbConnection } from './config/db-connection';
import logger from './middlewares/logger';

const port: number = Number(process.env.API_PORT) || 3000;

const startServer = async () => {
  try {
    // Test de la connexion à la base de données avant de démarrer l'API
    await testDbConnection();

    //Démarrage du serveur
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server: ' + String(error));
    process.exit(1);
  }
};

// Gestion de la fermeture propre du serveur et de la connexion à la BDD
process.on('SIGINT', async () => {
  logger.info('SIGINT received: closing server');
  try {
    await closeDbConnection();
    logger.info('DB connection closed');
  } catch (err) {
    logger.error('Error closing DB connection: ' + String(err));
  } finally {
    process.exit(0);
  }
});

startServer();
