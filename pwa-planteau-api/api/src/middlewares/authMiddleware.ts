import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './jwt';
import logger from './logger';

export interface AuthenticatedRequest extends Request {
  user?: { id: string | number; email: string; role: string };
}

export default function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = (req as any).cookies?.access_token;

    if (!token) {
      logger.http("Jeton d'accès manquant");
      return res.status(401).json({ message: "Jeton d'accès manquant, accès interdit." });
    }

    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    if (err instanceof Error && err.message.includes('expired')) {
      logger.http('Token expiré');
      return res.status(401).json({ message: 'Token expiré.' });
    }
    logger.http("Token invalide ou erreur d'authentification");
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}
