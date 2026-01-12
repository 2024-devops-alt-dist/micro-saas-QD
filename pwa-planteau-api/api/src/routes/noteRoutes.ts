import { Router } from 'express';
import { getAll, getById, createOne, deleteOne, updateOne } from '../controllers/noteController';
import { validateBody } from '../middlewares/validate';
import { NoteCreateSchema } from '../models/noteSchema';

export const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateBody(NoteCreateSchema), createOne);
router.delete('/:id', deleteOne);
