import { Router } from 'express';
import { getAll, getById, createOne, deleteOne } from '../controllers/noteController';

export const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createOne);
router.delete('/:id', deleteOne);
