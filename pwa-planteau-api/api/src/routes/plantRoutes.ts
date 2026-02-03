import { Router } from 'express';
import { getAll, getById, createOne, deleteOne, updateOne } from '../controllers/plantController';
import { validateBody } from '../middlewares/validate';
import { PlantCreateSchema } from '../models/plantSchema';

export const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all plants
 *     description: Retrieve a list of all plants
 *     tags:
 *       - Plants
 *     responses:
 *       200:
 *         description: List of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plant'
 *       500:
 *         description: Server error
 */
router.get('/', getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get plant by ID
 *     description: Retrieve a specific plant by its ID
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plant ID
 *     responses:
 *       200:
 *         description: Plant found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new plant
 *     description: Add a new plant to the system
 *     tags:
 *       - Plants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Monstera Deliciosa
 *               scientific_name:
 *                 type: string
 *                 example: Monstera deliciosa
 *               type:
 *                 type: string
 *                 example: TROPICAL
 *               image:
 *                 type: string
 *                 format: uri
 *               water_need:
 *                 type: integer
 *                 description: Watering frequency in days
 *                 example: 7
 *               room:
 *                 type: string
 *                 example: Living Room
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               household_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Plant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', validateBody(PlantCreateSchema), createOne);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a plant
 *     description: Update plant information
 *     tags:
 *       - Plants
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
 *               scientific_name:
 *                 type: string
 *               type:
 *                 type: string
 *               image:
 *                 type: string
 *               water_need:
 *                 type: integer
 *               room:
 *                 type: string
 *               user_id:
 *                 type: integer
 *               household_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Plant updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', validateBody(PlantCreateSchema), updateOne);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a plant
 *     description: Delete a plant from the system
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Plant deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', deleteOne);
