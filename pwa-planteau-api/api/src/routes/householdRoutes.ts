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

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateBody(HouseholdCreateSchema), createOne);
router.put('/:id', validateBody(HouseholdCreateSchema), updateOne);
router.delete('/:id', deleteOne);
