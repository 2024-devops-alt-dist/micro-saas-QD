import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export type JWTPayload = Record<string, any>;

export function createAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as any,
  });
}

export function createRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as any,
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
}
