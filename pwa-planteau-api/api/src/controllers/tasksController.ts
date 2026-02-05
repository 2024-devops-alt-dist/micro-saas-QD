import { Request, Response } from 'express';
import * as service from '../services/tasksService';
import logger from '../middlewares/logger';

export const getAll = async (_req: Request, res: Response) => {
  try {
    const items = await service.findAll();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = await service.findById(id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const createOne = async (req: Request, res: Response) => {
  try {
    logger.info(`Creating task with data:`, JSON.stringify(req.body));
    const created = await service.create(req.body);
    logger.info(`Task created:`, JSON.stringify(created));
    res.status(201).json(created);
  } catch (err: any) {
    logger.error(`Error creating task: ${err.message}`);
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await service.remove(id);
  res.status(204).send();
};

export const updateOne = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
