import { Router } from 'express';
import { getAll, getById, createOne, deleteOne, updateOne } from '../controllers/tasksController';
import { validateBody } from '../middlewares/validate';
import { TasksCreateSchema } from '../models/tasksSchema';

export const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateBody(TasksCreateSchema), createOne);
router.put('/:id', validateBody(TasksCreateSchema), updateOne);
router.delete('/:id', deleteOne);
