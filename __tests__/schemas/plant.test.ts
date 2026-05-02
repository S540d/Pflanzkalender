import { ActivitySchema, PlantSchema, ImportDataSchema } from '../../src/schemas/plant';

const validActivity = {
  id: 'sow-0-5',
  type: 'sow',
  startMonth: 0,
  endMonth: 5,
  color: '#8B4513',
  label: 'Aussäen',
};

const validPlant = {
  id: 'plant-1',
  name: 'Tomaten',
  isDefault: true,
  userId: null,
  activities: [validActivity],
  notes: 'Test',
  location: 'sun' as const,
  category: 'vegetable' as const,
  createdAt: 1000,
  updatedAt: 1000,
};

describe('ActivitySchema', () => {
  it('akzeptiert eine gültige Aktivität', () => {
    expect(ActivitySchema.safeParse(validActivity).success).toBe(true);
  });

  it('lehnt startMonth < 0 ab', () => {
    expect(ActivitySchema.safeParse({ ...validActivity, startMonth: -1 }).success).toBe(false);
  });

  it('lehnt endMonth > 23 ab', () => {
    expect(ActivitySchema.safeParse({ ...validActivity, endMonth: 24 }).success).toBe(false);
  });

  it('lehnt fehlende Pflichtfelder ab', () => {
    const { id, ...noId } = validActivity;
    expect(ActivitySchema.safeParse(noId).success).toBe(false);
  });
});

describe('PlantSchema', () => {
  it('akzeptiert eine gültige Pflanze', () => {
    expect(PlantSchema.safeParse(validPlant).success).toBe(true);
  });

  it('akzeptiert Pflanze ohne optionale Felder', () => {
    const { location, category, ...minimal } = validPlant;
    expect(PlantSchema.safeParse(minimal).success).toBe(true);
  });

  it('lehnt leeren Namen ab', () => {
    expect(PlantSchema.safeParse({ ...validPlant, name: '' }).success).toBe(false);
  });

  it('lehnt ungültigen location-Wert ab', () => {
    expect(PlantSchema.safeParse({ ...validPlant, location: 'roof' }).success).toBe(false);
  });

  it('lehnt ungültigen category-Wert ab', () => {
    expect(PlantSchema.safeParse({ ...validPlant, category: 'cactus' }).success).toBe(false);
  });

  it('lehnt nicht-nullable userId ab', () => {
    expect(PlantSchema.safeParse({ ...validPlant, userId: 123 }).success).toBe(false);
  });
});

describe('ImportDataSchema', () => {
  const validImport = {
    version: '1.0.0',
    timestamp: '2026-01-01T00:00:00.000Z',
    plants: [validPlant],
  };

  it('akzeptiert gültiges Import-Objekt', () => {
    expect(ImportDataSchema.safeParse(validImport).success).toBe(true);
  });

  it('akzeptiert leeres plants-Array', () => {
    expect(ImportDataSchema.safeParse({ ...validImport, plants: [] }).success).toBe(true);
  });

  it('lehnt fehlende version ab', () => {
    const { version, ...noVersion } = validImport;
    expect(ImportDataSchema.safeParse(noVersion).success).toBe(false);
  });

  it('lehnt unbekannte version ab', () => {
    expect(ImportDataSchema.safeParse({ ...validImport, version: '2.0.0' }).success).toBe(false);
  });

  it('lehnt nicht-ISO timestamp ab', () => {
    expect(ImportDataSchema.safeParse({ ...validImport, timestamp: 'yesterday' }).success).toBe(false);
  });

  it('lehnt ungültige Pflanze im Array ab', () => {
    const broken = { ...validImport, plants: [{ id: 'x' }] };
    expect(ImportDataSchema.safeParse(broken).success).toBe(false);
  });

  it('liefert verständliche Fehlermeldung bei ungültigem Format', () => {
    const result = ImportDataSchema.safeParse({ plants: 'not-an-array' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});
