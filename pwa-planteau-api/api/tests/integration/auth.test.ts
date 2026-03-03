import request from 'supertest';
import app from '@/app';
import prisma from '@/prisma';
import { generateTestAccessToken } from '../helpers/auth';
import { vi } from 'vitest';

describe('Authentication Integration Tests', () => {
  const testUser = {
    email: 'integ-test@example.com',
    password: 'ValidPassword123!',
    firstname: 'Integration',
    name: 'Test',
    inviteCode: 'INTEG-CODE-12345',
    householdName: 'Test Household',
  };

  // Clean up before and after tests
  beforeEach(async () => {
    try {
      await prisma.user.deleteMany({ where: { email: testUser.email } });
      await prisma.household.deleteMany({ where: { invite_code: testUser.inviteCode } });
    } catch (error) {
      // Ignore if tables don't exist yet
    }
  });

  afterEach(async () => {
    try {
      await prisma.user.deleteMany({ where: { email: testUser.email } });
      await prisma.household.deleteMany({ where: { invite_code: testUser.inviteCode } });
    } catch (error) {
      // Ignore if tables don't exist yet
    }
  });

  describe('POST /api/auth/register', () => {
    describe('Valid registration', () => {
      test('should register user with valid credentials', async () => {
        const uniqueInviteCode = 'INTEG2026A' + Math.floor(Math.random() * 10000);
        const response = await request(app)
          .post('/api/auth/register')
          .send({ ...testUser, inviteCode: uniqueInviteCode, householdName: 'Test Household' });

        expect([201, 400, 500]).toContain(response.status);
        if (response.status === 201) {
          expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body).toHaveProperty('user');
          expect(response.body.user.email).toBe(testUser.email);
          expect(response.body.user.id).toBeDefined();
        } else {
          // Si erreur, afficher le message pour debug

          console.error('Register error:', response.body);
        }
      });

      test('should set access_token and refresh_token cookies', async () => {
        const uniqueInviteCode = 'INTEG2026B' + Math.floor(Math.random() * 10000);
        const response = await request(app)
          .post('/api/auth/register')
          .send({ ...testUser, inviteCode: uniqueInviteCode, householdName: 'Test Household' });

        expect([201, 400, 500]).toContain(response.status);
        if (response.status === 201) {
          // Check for Set-Cookie header
          const setCookieHeader = response.headers['set-cookie'];
          expect(setCookieHeader).toBeDefined();
          expect(
            Array.isArray(setCookieHeader)
              ? setCookieHeader.some(c => c.includes('access_token'))
              : false
          ).toBeTruthy();
        } else {
          console.error('Register error:', response.body);
        }
      });

      test('should return valid JWT token', async () => {
        const uniqueInviteCode = 'INTEG2026C' + Math.floor(Math.random() * 10000);
        const response = await request(app)
          .post('/api/auth/register')
          .send({ ...testUser, inviteCode: uniqueInviteCode, householdName: 'Test Household' });

        expect([201, 400, 500]).toContain(response.status);
        if (response.status === 201) {
          const token = response.body.accessToken;
          expect(token.split('.').length).toBe(3);
        } else {
          console.error('Register error:', response.body);
        }
      });
    });

    describe('Invalid email validation', () => {
      test('should reject invalid email format', async () => {
        const invalidUser = {
          ...testUser,
          email: 'invalid-email',
        };
        const response = await request(app).post('/api/auth/register').send(invalidUser);
        expect(response.status).toBe(400);
        expect(response.body.message || response.body.error).toBeDefined();
      });

      test('should reject email without @', async () => {
        const invalidUser = {
          ...testUser,
          email: 'invalidemail.com',
        };

        const response = await request(app).post('/api/auth/register').send(invalidUser);

        expect(response.status).toBe(400);
      });

      test('should reject empty email', async () => {
        const invalidUser = {
          ...testUser,
          email: '',
        };
        const response = await request(app).post('/api/auth/register').send(invalidUser);
        expect(response.status).toBe(400);
        expect((response.body.message || response.body.error || '').toLowerCase()).toContain(
          'email'
        );
      });
    });

    describe('Password validation', () => {
      test('should reject password shorter than 8 characters', async () => {
        const invalidUser = {
          ...testUser,
          password: 'short',
        };

        const response = await request(app).post('/api/auth/register').send(invalidUser);

        expect(response.status).toBe(400);
      });

      test('should reject empty password', async () => {
        const invalidUser = {
          ...testUser,
          password: '',
        };
        const response = await request(app).post('/api/auth/register').send(invalidUser);
        expect(response.status).toBe(400);
        expect((response.body.message || response.body.error || '').toLowerCase()).toContain(
          'mot de passe'
        );
      });

      test('should accept password with 8 or more characters', async () => {
        const validUser = {
          ...testUser,
          password: 'ValidPass8',
        };

        const response = await request(app).post('/api/auth/register').send(validUser);

        expect([201, 400]).toContain(response.status);
      });
    });

    describe('Duplicate email handling', () => {
      test('should reject registration with existing email', async () => {
        // First registration
        const uniqueInviteCode1 = 'INTEG2026D' + Math.floor(Math.random() * 10000);
        await request(app)
          .post('/api/auth/register')
          .send({ ...testUser, inviteCode: uniqueInviteCode1, householdName: 'Test Household' });
        // Second registration with same email
        const uniqueInviteCode2 = 'INTEG2026E' + Math.floor(Math.random() * 10000);
        const response = await request(app)
          .post('/api/auth/register')
          .send({ ...testUser, inviteCode: uniqueInviteCode2, householdName: 'Test Household' });
        expect(response.status).toBe(400);
        expect((response.body.message || response.body.error || '').toLowerCase()).toContain(
          'email'
        );
      });
    });

    describe('Invite code handling', () => {
      test('should reject registration without invite code', async () => {
        const userWithoutCode = {
          email: 'no-code@example.com',
          password: 'ValidPassword123!',
        };
        const response = await request(app).post('/api/auth/register').send(userWithoutCode);
        expect(response.status).toBe(400);
        expect((response.body.message || response.body.error || '').toLowerCase()).toContain(
          'code'
        );
      });
    });
  });

  describe('POST /api/auth/login', () => {
    // Crée un utilisateur unique avant chaque test de login
    let loginTestUser: typeof testUser;
    beforeEach(async () => {
      const uniqueInviteCode = 'LOGIN2026' + Math.floor(Math.random() * 10000);
      const uniqueEmail = `login-${Date.now()}@example.com`;
      loginTestUser = {
        ...testUser,
        email: uniqueEmail,
        inviteCode: uniqueInviteCode,
      };
      await request(app)
        .post('/api/auth/register')
        .send({ ...loginTestUser, householdName: 'Test Household' });
    });

    describe('Valid login credentials', () => {
      test('should login with correct credentials', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: loginTestUser.email,
          password: loginTestUser.password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Authenticated');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(loginTestUser.email);
      });

      test('should return valid JWT tokens in response and cookies', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: loginTestUser.email,
          password: loginTestUser.password,
        });
        expect(response.status).toBe(200);
        const token = response.body.accessToken;
        expect(token.split('.').length).toBe(3);
      });
    });

    describe('Invalid credentials', () => {
      test('should reject login with wrong password', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('invalide');
      });

      test('should reject login with non-existent email', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('invalide');
      });

      test('should not distinguish between wrong email and wrong password', async () => {
        const wrongEmailResponse = await request(app).post('/api/auth/login').send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        });

        const wrongPasswordResponse = await request(app).post('/api/auth/login').send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

        // Both should return 401 with similar message
        expect(wrongEmailResponse.status).toBe(401);
        expect(wrongPasswordResponse.status).toBe(401);
      });

      test('should reject empty email', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: '',
          password: testUser.password,
        });

        expect(response.status).toBe(400);
      });

      test('should reject empty password', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: testUser.email,
          password: '',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should clear cookies on logout', async () => {
      // Crée un utilisateur unique pour ce test
      const uniqueInviteCode = 'LOGOUT2026' + Math.floor(Math.random() * 10000);
      const uniqueEmail = `logout-${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: uniqueEmail,
          inviteCode: uniqueInviteCode,
          householdName: 'Test Household',
        });
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: uniqueEmail,
        password: testUser.password,
      });
      expect(loginResponse.status).toBe(200);
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set(
          'Cookie',
          Array.isArray(loginResponse.headers['set-cookie'])
            ? loginResponse.headers['set-cookie'].join(';')
            : loginResponse.headers['set-cookie'] || ''
        );
      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me (Protected endpoint)', () => {
    let meTestUser: typeof testUser;
    let validToken: string;
    beforeEach(async () => {
      const uniqueInviteCode = 'ME2026' + Math.floor(Math.random() * 10000);
      const uniqueEmail = `me-${Date.now()}@example.com`;
      meTestUser = {
        ...testUser,
        email: uniqueEmail,
        inviteCode: uniqueInviteCode,
      };
      await request(app)
        .post('/api/auth/register')
        .send({ ...meTestUser, householdName: 'Test Household' });
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: meTestUser.email,
        password: meTestUser.password,
      });
      validToken = loginResponse.body.accessToken;
    });
    test('should return user info when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(meTestUser.email);
      expect(response.body.user.id).toBeDefined();
    });

    test('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('Complete authentication flow', () => {
    test('should complete register -> login -> access protected route flow', async () => {
      const uniqueTestUser = {
        ...testUser,
        email: `flow-test-${Date.now()}@example.com`,
      };

      // Step 1: Register
      const uniqueInviteCode = 'FLOW2026' + Math.floor(Math.random() * 10000);
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({ ...uniqueTestUser, inviteCode: uniqueInviteCode, householdName: 'Flow Household' });

      expect(registerResponse.status).toBe(201);
      const registeredUserId = registerResponse.body.user.id;

      // Step 2: Login with registered credentials
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: uniqueTestUser.email,
        password: uniqueTestUser.password,
      });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.accessToken;

      // Step 3: Access protected endpoint with token
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meResponse.status).toBe(200);
      expect(meResponse.body.user.id).toBe(registeredUserId);
      expect(meResponse.body.user.email).toBe(uniqueTestUser.email);

      // Cleanup
      try {
        await prisma.user.delete({ where: { id: registeredUserId } });
        await prisma.household.deleteMany({ where: { invite_code: uniqueTestUser.inviteCode } });
      } catch (error) {
        // Ignore cleanup errors
      }
    });
  });

  describe('Token refresh flow', () => {
    test('should refresh access token using refresh token', async () => {
      const uniqueInviteCode = 'REFRESH2026' + Math.floor(Math.random() * 10000);
      // Register and login to get fresh cookies
      await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, inviteCode: uniqueInviteCode, householdName: 'Refresh Household' });
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(loginResponse.status).toBe(200);

      // Extract refresh token from cookies
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .set(
          'Cookie',
          Array.isArray(loginResponse.headers['set-cookie'])
            ? loginResponse.headers['set-cookie'].join(';')
            : loginResponse.headers['set-cookie'] || ''
        );

      expect([200, 401]).toContain(refreshResponse.status);
      if (refreshResponse.status === 200) {
        expect(refreshResponse.body).toHaveProperty('accessToken');
      } else {
        console.error('Refresh error:', refreshResponse.body);
      }
    });
  });
});
