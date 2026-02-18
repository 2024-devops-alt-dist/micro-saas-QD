export const TasksUpdateSchema = z.object({
  type: z
    .enum([
      'WATERING',
      'REPOTTING',
      'PRUNING',
      'SPRAYING',
      'CLEAN_LEAVES',
      'FERTILIZING',
      'DEADHEADING',
    ])
    .optional(),
  scheduled_date: z
    .string()
    .refine(
      value =>
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) && !Number.isNaN(Date.parse(value)),
      {
        message: 'Doit être une date ISO valide (YYYY-MM-DDTHH:mm:ss)',
      }
    )
    .optional(),
  status: z.enum(['TODO', 'DONE', 'SKIPPED']).optional(),
  plant_id: z.number().int().optional(),
  frequency_days: z.number().int().min(1).optional(),
});

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
  scheduled_date: z
    .string()
    .refine(
      value =>
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) && !Number.isNaN(Date.parse(value)),
      {
        message: 'Doit être une date ISO valide (YYYY-MM-DDTHH:mm:ss)',
      }
    ),
  status: z.enum(['TODO', 'DONE', 'SKIPPED']),
  plant_id: z.number().int(),
  frequency_days: z.number().int().min(1).optional(),
});

export type TasksCreateInput = z.infer<typeof TasksCreateSchema>;
