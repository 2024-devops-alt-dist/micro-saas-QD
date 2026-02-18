import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

export const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Verify API is running and database connection is working
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.get('/', healthCheck);
