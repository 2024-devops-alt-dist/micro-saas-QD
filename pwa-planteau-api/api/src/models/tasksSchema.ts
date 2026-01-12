import { z } from 'zod';

export const TasksCreateSchema = z.object({
  type: z.enum([
    'WATERING',
    'REPOTTING',
    'PRUNING',
    'SPRAYING',
    'CLEAN_LEAVES',
    'FERTILIZING',
    'DEADHEADING',
  ]),
  scheduled_date: z.string().refine(value => !Number.isNaN(Date.parse(value)), {
    message: 'Doit être une date ISO valide',
  }),
  status: z.enum(['TODO', 'DONE', 'SKIPPED']),
  plant_id: z.number().int(),
});

export type TasksCreateInput = z.infer<typeof TasksCreateSchema>;
