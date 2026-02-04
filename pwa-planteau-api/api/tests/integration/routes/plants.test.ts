import request from 'supertest';
import app from '@/app';
import { generateTestAccessToken } from '../../helpers/auth';

describe('Plant Routes - Integration Tests', () => {
  describe('GET /api/plants', () => {
    test('should return 200 with plants array', async () => {
      const token = generateTestAccessToken({ id: 1, email: 'test@example.com', role: 'MEMBER' });
      const response = await request(app).get('/api/plants').set('Cookie', `access_token=${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return JSON format', async () => {
      const token = generateTestAccessToken({ id: 1, email: 'test@example.com', role: 'MEMBER' });
      const response = await request(app).get('/api/plants').set('Cookie', `access_token=${token}`);

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('POST /api/plants - Validation Tests', () => {
    test('should return 400 when required fields are missing', async () => {
      const token = generateTestAccessToken({ id: 1, email: 'test@example.com', role: 'MEMBER' });
      const invalidPlant = {
        name: 'Monstera',
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/plants')
        .set('Cookie', `access_token=${token}`)
        .send(invalidPlant);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'ValidationError');
      expect(response.body).toHaveProperty('details');
    });

    test('should return 400 when type is invalid enum', async () => {
      const token = generateTestAccessToken({ id: 1, email: 'test@example.com', role: 'MEMBER' });
      const invalidPlant = {
        name: 'Monstera',
        scientific_name: 'Monstera deliciosa',
        type: 'INVALID_TYPE', // Invalid enum
        photo: 'https://example.com/photo.jpg',
        water_need: 'Weekly',
        room: 'Living Room',
        user_id: 1,
        household_id: 1,
      };

      const response = await request(app)
        .post('/api/plants')
        .set('Cookie', `access_token=${token}`)
        .send(invalidPlant);

      expect(response.status).toBe(400);
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'type',
        })
      );
    });

    test('should return 400 when user_id is not integer', async () => {
      const token = generateTestAccessToken({ id: 1, email: 'test@example.com', role: 'MEMBER' });
      const invalidPlant = {
        name: 'Monstera',
        scientific_name: 'Monstera deliciosa',
        type: 'TROPICAL',
        photo: 'https://example.com/photo.jpg',
        water_need: 'Weekly',
        room: 'Living Room',
        user_id: 'not-a-number',
        household_id: 1,
      };

      const response = await request(app)
        .post('/api/plants')
        .set('Cookie', `access_token=${token}`)
        .send(invalidPlant);

      expect(response.status).toBe(400);
    });
  });

  describe('Error Handling', () => {
    test('should return JSON error on invalid request', async () => {
      const token = generateTestAccessToken({ id: 1, email: 'test@example.com', role: 'MEMBER' });
      const response = await request(app)
        .post('/api/plants')
        .set('Cookie', `access_token=${token}`)
        .send({ invalid: 'data' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
