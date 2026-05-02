import { z } from 'zod';

export const ActivitySchema = z.object({
  id: z.string(),
  type: z.string(),
  startMonth: z.number().int().min(0).max(23),
  endMonth: z.number().int().min(0).max(23),
  color: z.string(),
  label: z.string(),
});

export const PlantSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  isDefault: z.boolean(),
  userId: z.string().nullable(),
  activities: z.array(ActivitySchema),
  notes: z.string(),
  location: z.enum(['sun', 'partial-shade', 'shade']).optional(),
  category: z.enum(['vegetable', 'flower', 'tree']).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const ImportDataSchema = z.object({
  version: z.string(),
  timestamp: z.string(),
  plants: z.array(PlantSchema),
});

export type ValidatedPlant = z.infer<typeof PlantSchema>;
