import { Pool } from 'pg';
import logger from '../middlewares/logger';
import { PrismaClient } from '../generated/prisma/client';
import { config } from './env';

const prisma = new PrismaClient({
  datasourceUrl: config.DATABASE_URL,
});

export const testDbConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Connexion à la base de données réussie');
  } catch (error) {
    logger.error('Erreur de connexion à la base de données :', error);
    process.exit(1);
  }
};

export const closeDbConnection = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Connexion à la base de données fermée');
  } catch (error) {
    logger.error('Erreur lors de la fermeture de la connexion à la base de données :', error);
  }
};

export default prisma;
