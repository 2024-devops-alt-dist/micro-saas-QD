import { Router } from 'express';
import { getAll, getById, createOne, deleteOne, updateOne } from '../controllers/noteController';
import { validateBody } from '../middlewares/validate';
import { NoteCreateSchema } from '../models/noteSchema';

export const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all notes
 *     description: Retrieve all plant care notes
 *     tags:
 *       - Notes
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       500:
 *         description: Server error
 */
router.get('/', getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get note by ID
 *     description: Retrieve a specific note
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new note
 *     description: Add a note about a plant (observations, care history, etc.)
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - plant_id
 *             properties:
 *               content:
 *                 type: string
 *                 example: Plant shows signs of root rot
 *               plant_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', validateBody(NoteCreateSchema), createOne);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a note
 *     description: Update note content
 *     tags:
 *       - Notes
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
 *               content:
 *                 type: string
 *               plant_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', validateBody(NoteCreateSchema), updateOne);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a note permanently
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', deleteOne);
