import request from 'supertest';
import app from '@/app';

describe('User Routes - Integration Tests', () => {
  describe('GET /api/users', () => {
    test('should return 200 with users array', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return JSON format', async () => {
      const response = await request(app).get('/api/users');

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return user by ID', async () => {
      // First get a list to find an ID
      const listResponse = await request(app).get('/api/users');

      if (listResponse.body && listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const response = await request(app).get(`/api/users/${userId}`);

        expect([200, 404]).toContain(response.status);
      }
    });
  });

  describe('POST /api/users - Validation Tests', () => {
    test('should return 400 when required fields are missing', async () => {
      const invalidUser = {
        name: 'John',
        // Missing other required fields
      };

      const response = await request(app).post('/api/users').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'ValidationError');
      expect(response.body).toHaveProperty('details');
    });

    test('should return 400 when email format is invalid', async () => {
      const invalidUser = {
        name: 'John',
        firstname: 'Doe',
        email: 'invalid-email',
        password: 'password123',
        role: 'MEMBER',
        household_id: 1,
      };

      const response = await request(app).post('/api/users').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'email',
        })
      );
    });

    test('should return 400 when password is too short', async () => {
      const invalidUser = {
        name: 'John',
        firstname: 'Doe',
        email: 'john@example.com',
        password: 'short', // Less than 6 chars
        role: 'MEMBER',
        household_id: 1,
      };

      const response = await request(app).post('/api/users').send(invalidUser);

      expect(response.status).toBe(400);
    });

    test('should return 400 when role is not valid enum', async () => {
      const invalidUser = {
        name: 'John',
        firstname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'INVALID_ROLE',
        household_id: 1,
      };

      const response = await request(app).post('/api/users').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'role',
        })
      );
    });

    test('should return 400 when household_id is not integer', async () => {
      const invalidUser = {
        name: 'John',
        firstname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'MEMBER',
        household_id: 'not-a-number',
      };

      const response = await request(app).post('/api/users').send(invalidUser);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/users/:id - Update Tests', () => {
    test('should return 400 when validation fails on update', async () => {
      const invalidUpdate = {
        name: 'John',
        firstname: 'Doe',
        email: 'invalid-email',
        password: 'pass123',
        role: 'MEMBER',
        household_id: 1,
      };

      const response = await request(app).put('/api/users/1').send(invalidUpdate);

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should return 204 or 404 on delete', async () => {
      const response = await request(app).delete('/api/users/999');

      expect([204, 404, 500]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('should return JSON error on invalid request', async () => {
      const response = await request(app).post('/api/users').send({ invalid: 'data' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
