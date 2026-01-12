import { Request, Response } from 'express';
import * as service from '../services/tasksService';

export const getAll = async (_req: Request, res: Response) => {
  const items = await service.findAll();
  res.json(items);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = await service.findById(id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const createOne = async (req: Request, res: Response) => {
  const created = await service.create(req.body);
  res.status(201).json(created);
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
