import { z } from 'zod';

export const NoteCreateSchema = z.object({
  content: z.string().min(1),
  user_id: z.number().int(),
  plant_id: z.number().int().optional(),
  task_id: z.number().int().optional(),
});

export type NoteCreateInput = z.infer<typeof NoteCreateSchema>;
