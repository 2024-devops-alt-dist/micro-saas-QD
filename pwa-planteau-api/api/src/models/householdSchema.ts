import { z } from 'zod';

export const HouseholdCreateSchema = z.object({
  name: z.string().min(1),
  invite_code: z.string().min(1),
});

export type HouseholdCreateInput = z.infer<typeof HouseholdCreateSchema>;
