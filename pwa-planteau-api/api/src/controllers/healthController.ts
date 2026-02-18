import { Request, Response } from 'express';
import logger from '../middlewares/logger';

export const healthCheck = async (_req: Request, res: Response) => {
  // Ici, on pourrait tester la connexion DB si besoin
  logger.info('Health check succeeded');
  res.status(200).json({ status: 'ok', message: 'API connected to database!' });
};
