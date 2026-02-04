import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import logger from './logger';

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.http('Accès non autorisé : token manquant');
      return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as {
      userId: number;
      email: string;
    };

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.http('Token expiré');
      return res.status(401).json({ error: 'Le token a expiré.' });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logger.http('Token invalide');
      return res.status(401).json({ error: 'Token invalide.' });
    }

    logger.http("Erreur d'authentification");
    return res.status(401).json({ error: "Erreur d'authentification." });
  }
};

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as {
        userId: number;
        email: string;
      };

      req.userId = decoded.userId;
      req.userEmail = decoded.email;
    }

    next();
  } catch (error) {
    logger.http('Token optionnel non valide, continuation sans authentification');
    next();
  }
};
