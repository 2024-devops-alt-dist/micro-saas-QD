import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/middlewares/errorHandler';

describe('errorHandler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('Error handling', () => {
    test('should handle custom error with status', () => {
      const customError = new Error('Validation error');
      (customError as any).status = 400;

      errorHandler(customError, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Error',
          message: 'Validation error',
        })
      );
    });

    test('should handle error without status (default 500)', () => {
      const error = new Error('Internal server error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Error',
          message: 'Internal server error',
        })
      );
    });

    test('should include error details if provided', () => {
      const error = new Error('Validation failed');
      (error as any).status = 422;
      (error as any).details = { field: 'email', reason: 'Invalid format' };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Error',
          message: 'Validation failed',
          details: { field: 'email', reason: 'Invalid format' },
        })
      );
    });

    test('should skip error handling if headers already sent', () => {
      mockRes.headersSent = true;
      const error = new Error('Some error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should handle error with custom name', () => {
      const error = new Error('Not found');
      error.name = 'NotFoundError';
      (error as any).status = 404;

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'NotFoundError',
          message: 'Not found',
        })
      );
    });

    test('should handle generic error without message', () => {
      const error: any = {};

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'InternalServerError',
          message: 'Une erreur interne est survenue',
        })
      );
    });
  });

  describe('Response format', () => {
    test('should always return JSON with error, message, and optional details', () => {
      const error = new Error('Test error');
      (error as any).status = 400;

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const response = ((mockRes.json as any).mock.calls[0] || [])[0];
      expect(response).toHaveProperty('error');
      expect(response).toHaveProperty('message');
      expect(typeof response.error).toBe('string');
      expect(typeof response.message).toBe('string');
    });
  });
});
