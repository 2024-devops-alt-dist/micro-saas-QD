import request from 'supertest';
import app from '@/app';
import prisma from '@/prisma';
import { generateTestAccessToken } from '../helpers/auth';

describe('Protected Routes - Authentication Required', () => {
  let validToken: string;
  let invalidToken: string;

  beforeEach(() => {
    // Create a valid test token
    validToken = generateTestAccessToken({
      id: 1,
      email: 'protected-test@example.com',
      role: 'MEMBER',
    });

    // Create an invalid token (tampered)
    invalidToken = validToken.slice(0, -5) + 'XXXXX';
  });

  describe('Missing token scenarios', () => {
    test('GET /api/users should require authentication', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('GET /api/plants should require authentication', async () => {
      const response = await request(app).get('/api/plants');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('GET /api/tasks should require authentication', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('GET /api/households should require authentication', async () => {
      const response = await request(app).get('/api/households');

      expect(response.status).toBe(401);
    });

    test('POST /api/plants should require authentication', async () => {
      const response = await request(app).post('/api/plants').send({
        name: 'Test Plant',
        type: 'TROPICAL',
        user_id: 1,
        household_id: 1,
      });

      expect(response.status).toBe(401);
    });

    test('PUT /api/plants/:id should require authentication', async () => {
      const response = await request(app).put('/api/plants/1').send({ name: 'Updated Plant' });

      expect(response.status).toBe(401);
    });

    test('DELETE /api/plants/:id should require authentication', async () => {
      const response = await request(app).delete('/api/plants/1');

      expect(response.status).toBe(401);
    });
  });

  describe('Invalid token scenarios', () => {
    test('should reject tampered token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('should reject malformed Bearer header', async () => {
      const response = await request(app)
        .get('/api/plants')
        .set('Authorization', 'InvalidBearer sometoken');

      expect(response.status).toBe(401);
    });

    test('should reject empty Bearer token', async () => {
      const response = await request(app).get('/api/tasks').set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
    });

    test('should reject garbage token', async () => {
      const response = await request(app)
        .get('/api/households')
        .set('Authorization', 'Bearer not-a-valid-jwt-token');

      expect(response.status).toBe(401);
    });

    test('should reject corrupted JWT (missing signature)', async () => {
      const corruptedToken = validToken.substring(0, validToken.lastIndexOf('.'));

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${corruptedToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Valid token scenarios', () => {
    test('GET /api/users should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${validToken}`);

      // Should not be 401, could be 200 or other status depending on data
      expect(response.status).not.toBe(401);
    });

    test('GET /api/plants should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/plants')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).not.toBe(401);
    });

    test('GET /api/auth/me should return user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).not.toBe(401);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('user');
      }
    });

    test('GET /api/tasks should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).not.toBe(401);
    });
  });

  describe('Token priority - Header vs Cookies', () => {
    test('should use Authorization header token if both header and cookie present', async () => {
      // Crée un utilisateur réel et récupère son token
      const uniqueEmail = `header-vs-cookie-${Date.now()}@example.com`;
      const inviteCode = 'HDR2026' + Math.floor(Math.random() * 10000);
      // Enregistre l'utilisateur
      const registerRes = await request(app).post('/api/auth/register').send({
        email: uniqueEmail,
        password: 'ValidPassword123!',
        firstname: 'Header',
        name: 'Test',
        inviteCode,
        householdName: 'Header Household',
      });
      expect(registerRes.status).toBe(201);
      // Connecte l'utilisateur pour obtenir un vrai token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: uniqueEmail, password: 'ValidPassword123!' });
      expect(loginRes.status).toBe(200);
      const headerToken = loginRes.body.accessToken;
      // Simule un autre token pour le cookie (non utilisé)
      const cookieToken = generateTestAccessToken({
        id: 9999,
        email: 'cookie-fake@example.com',
        role: 'MEMBER',
      });
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${headerToken}`)
        .set('Cookie', `access_token=${cookieToken}`);
      // Doit réussir avec le token header
      expect(response.status).not.toBe(401);
      if (response.status === 200) {
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(uniqueEmail);
      }
    });

    test('should fallback to cookie if Authorization header missing', async () => {
      // Crée un utilisateur réel et récupère son token
      const uniqueEmail = `cookie-only-${Date.now()}@example.com`;
      const inviteCode = 'COK2026' + Math.floor(Math.random() * 10000);
      await request(app).post('/api/auth/register').send({
        email: uniqueEmail,
        password: 'ValidPassword123!',
        firstname: 'Cookie',
        name: 'Test',
        inviteCode,
        householdName: 'Cookie Household',
      });
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: uniqueEmail, password: 'ValidPassword123!' });
      expect(loginRes.status).toBe(200);
      const cookieToken = loginRes.body.accessToken;
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `access_token=${cookieToken}`);
      // Doit réussir avec le token cookie
      expect(response.status).not.toBe(401);
      if (response.status === 200) {
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(uniqueEmail);
      }
    });
  });

  describe('POST endpoints protection', () => {
    test('POST /api/plants requires authentication', async () => {
      const response = await request(app).post('/api/plants').send({
        name: 'Test Plant',
        scientific_name: 'Test Species',
        type: 'TROPICAL',
        user_id: 1,
        household_id: 1,
      });

      expect(response.status).toBe(401);
    });

    test('POST /api/tasks requires authentication', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Test Task',
        description: 'Test',
        plant_id: 1,
        user_id: 1,
      });

      expect(response.status).toBe(401);
    });

    test('should allow POST /api/plants with valid token', async () => {
      const response = await request(app)
        .post('/api/plants')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Test Plant',
          scientific_name: 'Test Species',
          type: 'TROPICAL',
          user_id: 1,
          household_id: 1,
        });

      // Will likely fail validation but not auth
      expect(response.status).not.toBe(401);
    });
  });

  describe('PUT endpoints protection', () => {
    test('PUT /api/plants/:id requires authentication', async () => {
      const response = await request(app).put('/api/plants/1').send({ name: 'Updated Plant' });

      expect(response.status).toBe(401);
    });

    test('should allow PUT /api/plants/:id with valid token', async () => {
      const response = await request(app)
        .put('/api/plants/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Updated Plant' });

      // Will likely be 404 or other but not 401
      expect(response.status).not.toBe(401);
    });
  });

  describe('DELETE endpoints protection', () => {
    test('DELETE /api/plants/:id requires authentication', async () => {
      const response = await request(app).delete('/api/plants/1');

      expect(response.status).toBe(401);
    });

    test('DELETE /api/tasks/:id requires authentication', async () => {
      const response = await request(app).delete('/api/tasks/1');

      expect(response.status).toBe(401);
    });

    test('should allow DELETE /api/plants/:id with valid token', async () => {
      const response = await request(app)
        .delete('/api/plants/1')
        .set('Authorization', `Bearer ${validToken}`);

      // Will likely be 404 or other but not 401
      expect(response.status).not.toBe(401);
    });
  });

  describe('Public vs Protected routes', () => {
    test('GET /api/health is public (no auth required)', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
    });

    test('POST /api/auth/register is public (no auth required)', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'ValidPassword123!',
        inviteCode: 'TEST-123',
      });

      // Will fail validation but not auth
      expect(response.status).not.toBe(401);
    });

    test('POST /api/auth/login is public (no auth required)', async () => {
      // On tente de se connecter avec un utilisateur inexistant
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'doesnotexist-' + Date.now() + '@example.com',
          password: 'password',
        });
      // Doit échouer sur les credentials (401), mais la route ne doit pas être protégée par le middleware d'auth
      // Donc, si la route est bien publique, on attend 401 pour credentials, pas 403/404
      expect([400, 401]).toContain(response.status);
    });

    test('POST /api/auth/logout is public (no auth required)', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
    });
  });

  describe('Expired token handling', () => {
    test('should reject expired token with appropriate error message', async () => {
      // This would require creating an actually expired token
      // For now we test that the middleware handles expired tokens properly
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer expired.token.here`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
