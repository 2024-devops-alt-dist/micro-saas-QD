import jwt from 'jsonwebtoken';
import { config } from '../../src/config/env';

/**
 * Génère un token JWT d'accès valide pour les tests
 */
export function generateTestAccessToken(payload: { id: number; email: string; role: string }) {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as any,
  });
}

/**
 * Crée un cookie access_token valide pour les requêtes de test
 */
export function generateTestCookie() {
  const accessToken = generateTestAccessToken({
    id: 1,
    email: 'test@example.com',
    role: 'MEMBER',
  });

  return `access_token=${accessToken}`;
}
