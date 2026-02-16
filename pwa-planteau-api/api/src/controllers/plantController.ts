import { Request, Response } from 'express';
import * as service from '../services/plantService';
import prisma from '../prisma';

export const getAll = async (req: Request, res: Response) => {
  try {
    // Récupère l'utilisateur authentifié depuis la requête (ajouté par authMiddleware)
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Récupère l'utilisateur pour obtenir son household_id
    const userRecord = await prisma.user.findUnique({
      where: { id: Number(user.id) },
    });
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Récupère uniquement les plantes du household de l'utilisateur
    const items = await prisma.plant.findMany({
      where: { household_id: userRecord.household_id },
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch plants', details: err.message });
  }
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
