export const UserUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'MEMBER']).optional(),
  household_id: z.number().int().optional(),
  photo: z.string().optional(),
});

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
import { z } from 'zod';

export const UserCreateSchema = z.object({
  name: z.string().min(1),
  firstname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'MEMBER']),
  household_id: z.number().int(),
});

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
