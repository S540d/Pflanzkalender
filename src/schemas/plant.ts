import { z } from 'zod';

export const ActivityCompletionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  type: z.string(),
  startMonth: z.number().int().min(0).max(23),
  endMonth: z.number().int().min(0).max(23),
  color: z.string(),
  label: z.string(),
  isCustomized: z.boolean().optional(),
  completions: z.record(z.string().regex(/^\d{4}$/), ActivityCompletionSchema).optional(),
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

// Toleranter als PlantSchema (das den Storage-Zustand strikt prüft): handbearbeitete oder
// ältere Exporte dürfen Metadaten-Felder weglassen, sie werden mit Defaults aufgefüllt.
export const ImportPlantSchema = PlantSchema.extend({
  isDefault: z.boolean().default(false),
  userId: z.string().nullable().default(null),
  notes: z.string().default(''),
  createdAt: z.number().default(() => Date.now()),
  updatedAt: z.number().default(() => Date.now()),
});

export const ImportDataSchema = z.object({
  version: z.literal('1.0.0'),
  timestamp: z.string().datetime().optional(),
  plants: z.array(ImportPlantSchema),
});

export type ValidatedPlant = z.infer<typeof PlantSchema>;

export function parseImportData(jsonString: string): ValidatedPlant[] {
  const raw = JSON.parse(jsonString);
  const result = ImportDataSchema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid import format: ${details}`);
  }
  return result.data.plants;
}
