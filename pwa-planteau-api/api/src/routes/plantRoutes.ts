import { Router } from 'express';
import { getAll, getById, createOne, deleteOne } from '../controllers/plantController';

export const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createOne);
router.delete('/:id', deleteOne);
