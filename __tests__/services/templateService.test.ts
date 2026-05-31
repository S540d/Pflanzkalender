import { buildExportJson, importFromJson } from '../../src/services/templateService';
import { Plant } from '../../src/types';

const makePlant = (overrides: Partial<Plant> = {}): Plant => ({
  id: 'plant-1',
  name: 'Tomaten',
  isDefault: false,
  userId: null,
  activities: [
    {
      id: 'sow-3-5',
      type: 'sow',
      startMonth: 3,
      endMonth: 5,
      color: '#8B4513',
      label: 'Aussäen',
    },
  ],
  notes: 'Testpflanze',
  location: 'sun',
  category: 'vegetable',
  createdAt: 1000000,
  updatedAt: 1000000,
  ...overrides,
});

describe('buildExportJson', () => {
  it('produces valid JSON with required fields', () => {
    const plants = [makePlant()];
    const json = buildExportJson(plants);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe('1.0.0');
    expect(typeof parsed.timestamp).toBe('string');
    expect(Array.isArray(parsed.plants)).toBe(true);
    expect(parsed.plants).toHaveLength(1);
  });

  it('includes all plant fields', () => {
    const plant = makePlant();
    const json = buildExportJson([plant]);
    const parsed = JSON.parse(json);
    const p = parsed.plants[0];

    expect(p.id).toBe(plant.id);
    expect(p.name).toBe(plant.name);
    expect(p.activities).toHaveLength(1);
    expect(p.notes).toBe(plant.notes);
  });

  it('handles empty plant array', () => {
    const json = buildExportJson([]);
    const parsed = JSON.parse(json);
    expect(parsed.plants).toHaveLength(0);
  });

  it('produces pretty-printed JSON', () => {
    const json = buildExportJson([makePlant()]);
    expect(json).toContain('\n');
  });

  it('timestamp is a valid ISO 8601 string', () => {
    const json = buildExportJson([]);
    const { timestamp } = JSON.parse(json);
    expect(() => new Date(timestamp)).not.toThrow();
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });
});

describe('importFromJson', () => {
  it('roundtrips a plant through export and import', () => {
    const plants = [makePlant()];
    const json = buildExportJson(plants);
    const imported = importFromJson(json);

    expect(imported).toHaveLength(1);
    expect(imported[0].name).toBe('Tomaten');
    expect(imported[0].activities).toHaveLength(1);
  });

  it('throws on invalid JSON syntax', () => {
    expect(() => importFromJson('not valid json {')).toThrow();
  });

  it('throws when version field is missing', () => {
    const bad = JSON.stringify({ timestamp: new Date().toISOString(), plants: [] });
    expect(() => importFromJson(bad)).toThrow(/Invalid import format/);
  });

  it('throws when version is wrong', () => {
    const bad = JSON.stringify({
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      plants: [],
    });
    expect(() => importFromJson(bad)).toThrow(/Invalid import format/);
  });

  it('throws when plants array contains invalid entry', () => {
    const bad = JSON.stringify({
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      plants: [{ id: 'x', name: '' }],
    });
    expect(() => importFromJson(bad)).toThrow(/Invalid import format/);
  });

  it('accepts optional location and category fields', () => {
    const plant = makePlant({ location: 'shade', category: 'flower' });
    const json = buildExportJson([plant]);
    const [imported] = importFromJson(json);
    expect(imported.location).toBe('shade');
    expect(imported.category).toBe('flower');
  });
});
