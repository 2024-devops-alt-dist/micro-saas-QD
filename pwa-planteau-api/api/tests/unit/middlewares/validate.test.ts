import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { validateBody } from '@/middlewares/validate';
import { PlantCreateSchema } from '@/models/plantSchema';
import { z } from 'zod';

describe('validateBody Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('Valid data', () => {
    test('should call next() when body is valid', () => {
      const validPlant = {
        name: 'Monstera',
        scientific_name: 'Monstera deliciosa',
        type: 'TROPICAL',
        photo: 'https://example.com/photo.jpg',
        water_need: 'Weekly',
        room: 'Living Room',
        user_id: 1,
        household_id: 1,
      };

      mockReq.body = validPlant;
      const middleware = validateBody(PlantCreateSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Missing required fields', () => {
    test('should return 400 when required field "name" is missing', () => {
      const invalidPlant = {
        scientific_name: 'Monstera deliciosa',
        type: 'TROPICAL',
        photo: 'https://example.com/photo.jpg',
        water_need: 'Weekly',
        room: 'Living Room',
        user_id: 1,
        household_id: 1,
      };

      mockReq.body = invalidPlant;
      const middleware = validateBody(PlantCreateSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalled();
      const response = ((mockRes.json as any).mock.calls[0] || [])[0];
      expect(response.error).toBe('ValidationError');
      expect(response.details).toHaveLength(1);
      expect(response.details[0].path).toBe('name');
    });

    test('should return 400 when multiple fields are missing', () => {
      const invalidPlant = {
        name: 'Monstera',
      };

      mockReq.body = invalidPlant;
      const middleware = validateBody(PlantCreateSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const response = ((mockRes.json as any).mock.calls[0] || [])[0];
      expect(response.details.length).toBeGreaterThan(1);
    });
  });

  describe('Invalid field types', () => {
    test('should return 400 when user_id is not an integer', () => {
      const invalidPlant = {
        name: 'Monstera',
        scientific_name: 'Monstera deliciosa',
        type: 'TROPICAL',
        photo: 'https://example.com/photo.jpg',
        water_need: 'Weekly',
        room: 'Living Room',
        user_id: 'not-an-id',
        household_id: 1,
      };

      mockReq.body = invalidPlant;
      const middleware = validateBody(PlantCreateSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should return 400 when type is not a valid enum', () => {
      const invalidPlant = {
        name: 'Monstera',
        scientific_name: 'Monstera deliciosa',
        type: 'INVALID_TYPE',
        photo: 'https://example.com/photo.jpg',
        water_need: 'Weekly',
        room: 'Living Room',
        user_id: 1,
        household_id: 1,
      };

      mockReq.body = invalidPlant;
      const middleware = validateBody(PlantCreateSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const response = ((mockRes.json as any).mock.calls[0] || [])[0];
      expect(response.details[0].path).toBe('type');
    });
  });

  describe('Invalid email format', () => {
    test('should reject invalid email formats', () => {
      const UserSchema = z.object({
        email: z.string().email(),
      });

      mockReq.body = { email: 'not-an-email' };
      const middleware = validateBody(UserSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const response = ((mockRes.json as any).mock.calls[0] || [])[0];
      expect(response.error).toBe('ValidationError');
    });
  });
});
