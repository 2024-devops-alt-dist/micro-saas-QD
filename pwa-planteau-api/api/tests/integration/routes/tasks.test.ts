import request from 'supertest';
import app from '@/app';

describe('Tasks Routes - Integration Tests', () => {
  describe('GET /api/tasks', () => {
    test('should return 200 with tasks array', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/tasks - Validation Tests', () => {
    test('should return 400 when required fields are missing', async () => {
      const invalidTask = {
        type: 'WATERING',
        // Missing other required fields
      };

      const response = await request(app).post('/api/tasks').send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'ValidationError');
      expect(response.body).toHaveProperty('details');
    });

    test('should return 400 when type is invalid enum', async () => {
      const invalidTask = {
        type: 'INVALID_TYPE',
        scheduled_date: '2026-02-03T10:00:00Z',
        status: 'TODO',
        plant_id: 1,
      };

      const response = await request(app).post('/api/tasks').send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'type',
        })
      );
    });

    test('should accept valid ISO date format', async () => {
      const validTask = {
        type: 'WATERING',
        scheduled_date: '2026-02-03T10:00:00Z', // Valid ISO format
        status: 'TODO',
        plant_id: 1,
      };

      const response = await request(app).post('/api/tasks').send(validTask);

      // Might fail due to DB constraints, but not validation error
      expect(response.status).not.toBe(400);
    });

    test('should return 400 when date is not ISO format', async () => {
      const invalidTask = {
        type: 'WATERING',
        scheduled_date: '02/03/2026', // Invalid ISO format
        status: 'TODO',
        plant_id: 1,
      };

      const response = await request(app).post('/api/tasks').send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'scheduled_date',
          message: expect.stringContaining('date ISO'),
        })
      );
    });

    test('should return 400 when status is invalid enum', async () => {
      const invalidTask = {
        type: 'WATERING',
        scheduled_date: '2026-02-03T10:00:00Z',
        status: 'INVALID_STATUS',
        plant_id: 1,
      };

      const response = await request(app).post('/api/tasks').send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'status',
        })
      );
    });

    test('should return 400 when plant_id is not integer', async () => {
      const invalidTask = {
        type: 'WATERING',
        scheduled_date: '2026-02-03T10:00:00Z',
        status: 'TODO',
        plant_id: 'not-a-number',
      };

      const response = await request(app).post('/api/tasks').send(invalidTask);

      expect(response.status).toBe(400);
    });

    test('should validate all task types', async () => {
      const validTypes = [
        'WATERING',
        'REPOTTING',
        'PRUNING',
        'SPRAYING',
        'CLEAN_LEAVES',
        'FERTILIZING',
        'DEADHEADING',
      ];

      for (const taskType of validTypes) {
        const task = {
          type: taskType,
          scheduled_date: '2026-02-03T10:00:00Z',
          status: 'TODO',
          plant_id: 1,
        };

        const response = await request(app).post('/api/tasks').send(task);

        // Should not fail validation (might fail DB constraint)
        expect(response.status).not.toBe(400);
      }
    });

    test('should validate all task statuses', async () => {
      const validStatuses = ['TODO', 'DONE', 'SKIPPED'];

      for (const taskStatus of validStatuses) {
        const task = {
          type: 'WATERING',
          scheduled_date: '2026-02-03T10:00:00Z',
          status: taskStatus,
          plant_id: 1,
        };

        const response = await request(app).post('/api/tasks').send(task);

        // Should not fail validation (might fail DB constraint)
        expect(response.status).not.toBe(400);
      }
    });
  });

  describe('PUT /api/tasks/:id - Update Tests', () => {
    test('should validate on update same as POST', async () => {
      const invalidUpdate = {
        type: 'INVALID',
        scheduled_date: '2026-02-03T10:00:00Z',
        status: 'TODO',
        plant_id: 1,
      };

      const response = await request(app).put('/api/tasks/1').send(invalidUpdate);

      expect(response.status).toBe(400);
    });
  });

  describe('Error Handling', () => {
    test('should return JSON error on invalid request', async () => {
      const response = await request(app).post('/api/tasks').send({ invalid: 'data' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
