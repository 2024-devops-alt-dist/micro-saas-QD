import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody =
  (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'ValidationError',
        details: parseResult.error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    req.body = parseResult.data;
    next();
  };
