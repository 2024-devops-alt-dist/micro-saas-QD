import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/middlewares/jwt';
import authMiddleware, { AuthenticatedRequest } from '@/middlewares/authMiddleware';
import jwt from 'jsonwebtoken';

describe('JWT Functions', () => {
  describe('createAccessToken', () => {
    test('should create a valid access token', () => {
      const payload = { id: 1, email: 'test@example.com', role: 'MEMBER' };
      const token = createAccessToken(payload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      // Verify token structure (3 parts separated by dots)
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    test('should encode payload in token', () => {
      const payload = { id: 123, email: 'test@example.com', role: 'ADMIN' };
      const token = createAccessToken(payload);
      const decoded = verifyAccessToken(token);

      expect(decoded.id).toBe(123);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('ADMIN');
    });

    test('should include expiration in token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = createAccessToken(payload);
      const decoded = verifyAccessToken(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
    });
  });

  describe('createRefreshToken', () => {
    test('should create a valid refresh token', () => {
      const payload = { id: 1 };
      const token = createRefreshToken(payload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    test('should encode payload in refresh token', () => {
      const payload = { id: 456 };
      const token = createRefreshToken(payload);
      const decoded = verifyRefreshToken(token);

      expect(decoded.id).toBe(456);
    });

    test('should have longer expiration than access token', () => {
      const payload = { id: 1 };
      const accessToken = createAccessToken(payload);
      const refreshToken = createRefreshToken(payload);

      const accessDecoded = verifyAccessToken(accessToken) as any;
      const refreshDecoded = verifyRefreshToken(refreshToken) as any;

      // Refresh token should expire later
      expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
    });
  });

  describe('verifyAccessToken', () => {
    test('should verify and decode a valid token', () => {
      const payload = { id: 1, email: 'test@example.com', role: 'MEMBER' };
      const token = createAccessToken(payload);
      const decoded = verifyAccessToken(token);

      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('MEMBER');
    });

    test('should throw error for invalid token signature', () => {
      const validToken = createAccessToken({ id: 1 });
      const tamperedToken = validToken.slice(0, -5) + 'XXXXX'; // Tamper with signature

      expect(() => {
        verifyAccessToken(tamperedToken);
      }).toThrow();
    });

    test('should throw error for expired token', () => {
      // Create a token with very short expiration
      const payload = { id: 1 };
      const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'test-secret', {
        expiresIn: '0s', // Expires immediately
      });

      // Wait a tiny bit to ensure expiration
      setTimeout(() => {
        expect(() => {
          verifyAccessToken(token);
        }).toThrow();
      }, 100);
    });

    test('should throw error for malformed token', () => {
      expect(() => {
        verifyAccessToken('invalid.token');
      }).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    test('should verify and decode a valid refresh token', () => {
      const payload = { id: 789 };
      const token = createRefreshToken(payload);
      const decoded = verifyRefreshToken(token);

      expect(decoded.id).toBe(789);
    });

    test('should throw error for invalid refresh token signature', () => {
      const validToken = createRefreshToken({ id: 1 });
      const tamperedToken = validToken.slice(0, -5) + 'XXXXX';

      expect(() => {
        verifyRefreshToken(tamperedToken);
      }).toThrow();
    });
  });
});

describe('Auth Middleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('Token from Authorization header', () => {
    test('should extract and verify token from Bearer header', () => {
      const payload = { id: 1, email: 'test@example.com', role: 'MEMBER' };
      const token = createAccessToken(payload);

      mockReq.headers = { authorization: `Bearer ${token}` };

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as any).user).toBeDefined();
      expect((mockReq as any).user.id).toBe(1);
      expect((mockReq as any).user.email).toBe('test@example.com');
    });

    test('should fail with malformed Bearer header', () => {
      const token = createAccessToken({ id: 1 });

      mockReq.headers = { authorization: `NotBearer ${token}` };

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Token from cookies', () => {
    test('should extract and verify token from access_token cookie', () => {
      const payload = { id: 2, email: 'cookie@example.com', role: 'ADMIN' };
      const token = createAccessToken(payload);

      mockReq.cookies = { access_token: token };

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as any).user.id).toBe(2);
      expect((mockReq as any).user.email).toBe('cookie@example.com');
    });

    test('should fail with missing token', () => {
      mockReq.headers = {};
      mockReq.cookies = {};

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Invalid and expired tokens', () => {
    test('should reject token with invalid signature', () => {
      const token = createAccessToken({ id: 1 });
      const tamperedToken = token.slice(0, -5) + 'XXXXX';

      mockReq.headers = { authorization: `Bearer ${tamperedToken}` };

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject malformed tokens', () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should set error message for expired token', () => {
      // Create an expired token
      const expiredToken = jwt.sign({ id: 1 }, process.env.JWT_ACCESS_SECRET || 'test-secret', {
        expiresIn: '0s',
      });

      mockReq.headers = { authorization: `Bearer ${expiredToken}` };

      // Wait a bit to ensure token is expired
      setTimeout(() => {
        authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        const response = ((mockRes.json as any).mock.calls[0] || [])[0];
        expect(response.message).toBeDefined();
        expect(mockNext).not.toHaveBeenCalled();
      }, 100);
    });
  });

  describe('Token priority', () => {
    test('should prefer Authorization header over cookies', () => {
      const headerPayload = { id: 100, email: 'header@example.com', role: 'ADMIN' };
      const cookiePayload = { id: 200, email: 'cookie@example.com', role: 'MEMBER' };

      const headerToken = createAccessToken(headerPayload);
      const cookieToken = createAccessToken(cookiePayload);

      mockReq.headers = { authorization: `Bearer ${headerToken}` };
      mockReq.cookies = { access_token: cookieToken };

      authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as any).user.id).toBe(100); // Header token should be used
      expect((mockReq as any).user.email).toBe('header@example.com');
    });
  });
});
