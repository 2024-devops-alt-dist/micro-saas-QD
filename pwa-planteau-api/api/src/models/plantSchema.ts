// Schéma de validation Zod pour la création d'une plante
import { z } from 'zod';

export const PlantCreateSchema = z.object({
  name: z.string().min(1),
  scientific_name: z.string().min(1),
  type: z.enum([
    'TROPICAL',
    'DESERT',
    'TEMPERATE',
    'SUCCULENT',
    'AQUATIC',
    'MEDITERRANEAN',
    'BONSAI',
    'ORCHID',
  ]),
  photo: z.string().min(1),
  water_need: z.string().min(1),
  room: z.string().min(1),
  user_id: z.number().int(),
  household_id: z.number().int(),
});

export type PlantCreateInput = z.infer<typeof PlantCreateSchema>;
