import { Router } from 'express';
import { getAll, getById, createOne, deleteOne, updateOne } from '../controllers/userController';
import { validateBody } from '../middlewares/validate';
import { UserCreateSchema } from '../models/userSchema';

export const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateBody(UserCreateSchema), createOne);
router.delete('/:id', deleteOne);
