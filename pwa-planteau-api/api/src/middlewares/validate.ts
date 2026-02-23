import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody =
  (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const details = parseResult.error.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      // Concatène tous les messages d'erreur pour un message global explicite
      const message = details.map(d => d.message).join(' | ');
      return res.status(400).json({
        error: 'ValidationError',
        message,
        details,
      });
    }
    req.body = parseResult.data;
    next();
  };
