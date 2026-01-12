import { Router } from 'express';
import { getAll, getById, createOne, deleteOne, updateOne } from '../controllers/plantController';
import { validateBody } from '../middlewares/validate';
import { PlantCreateSchema } from '../models/plantSchema';

export const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateBody(PlantCreateSchema), createOne);
router.delete('/:id', deleteOne);
