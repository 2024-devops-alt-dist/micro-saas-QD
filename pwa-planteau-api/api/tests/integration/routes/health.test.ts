import request from 'supertest';
import app from '@/app';

describe('Health Check Endpoint', () => {
  describe('GET /api/health', () => {
    test('should return 200 with status ok', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
    });

    test('should return JSON with correct structure', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers['content-type']).toMatch(/json/);
      expect(typeof response.body.status).toBe('string');
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('CORS Headers', () => {
    test('should include CORS headers in response', async () => {
      const response = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Request validation', () => {
    test('should reject invalid HTTP methods', async () => {
      const response = await request(app).post('/api/health');

      // POST not allowed on health endpoint
      expect([404, 405]).toContain(response.status);
    });
  });
});
