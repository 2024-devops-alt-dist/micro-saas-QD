import { Router } from 'express';
import {
  getAll,
  getById,
  createOne,
  deleteOne,
  updateOne,
} from '../controllers/householdController';
import { validateBody } from '../middlewares/validate';
import { HouseholdCreateSchema } from '../models/householdSchema';

export const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all households
 *     description: Retrieve a list of all households
 *     tags:
 *       - Households
 *     responses:
 *       200:
 *         description: List of households
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Household'
 *       500:
 *         description: Server error
 */
router.get('/', getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get household by ID
 *     description: Retrieve a specific household
 *     tags:
 *       - Households
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Household found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Household'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new household
 *     description: Create a new household group
 *     tags:
 *       - Households
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Home
 *               location:
 *                 type: string
 *                 example: Paris, France
 *     responses:
 *       201:
 *         description: Household created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Household'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', validateBody(HouseholdCreateSchema), createOne);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a household
 *     description: Update household information
 *     tags:
 *       - Households
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Household updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Household'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', validateBody(HouseholdCreateSchema), updateOne);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a household
 *     description: Delete a household permanently
 *     tags:
 *       - Households
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Household deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', deleteOne);
