import { DEFAULT_PLANTS } from '../../src/constants/defaultPlants';
import { PLANT_LOCATION_METADATA, PLANT_CATEGORY_METADATA } from '../../src/constants/plantMetadata';

const VALID_LOCATIONS = Object.keys(PLANT_LOCATION_METADATA);
const VALID_CATEGORIES = Object.keys(PLANT_CATEGORY_METADATA);
const VALID_ACTIVITY_TYPES = ['sow', 'plant', 'fertilize', 'water', 'prune', 'harvest', 'protect', 'mulch'];

describe('DEFAULT_PLANTS data integrity', () => {
  it('has at least 30 default plants', () => {
    expect(DEFAULT_PLANTS.length).toBeGreaterThanOrEqual(30);
  });

  it('every plant has a non-empty name', () => {
    DEFAULT_PLANTS.forEach(plant => {
      expect(plant.name).toBeTruthy();
    });
  });

  it('every plant has isDefault: true', () => {
    DEFAULT_PLANTS.forEach(plant => {
      expect(plant.isDefault).toBe(true);
    });
  });

  it('every plant has userId: null', () => {
    DEFAULT_PLANTS.forEach(plant => {
      expect(plant.userId).toBeNull();
    });
  });

  it('every plant has a valid location value', () => {
    DEFAULT_PLANTS.forEach(plant => {
      expect(VALID_LOCATIONS).toContain(plant.location);
    });
  });

  it('every plant has a valid category value', () => {
    DEFAULT_PLANTS.forEach(plant => {
      expect(VALID_CATEGORIES).toContain(plant.category);
    });
  });

  it('all plant names are unique', () => {
    const names = DEFAULT_PLANTS.map(p => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('contains plants of all three categories', () => {
    const categories = new Set(DEFAULT_PLANTS.map(p => p.category));
    expect(categories.has('vegetable')).toBe(true);
    expect(categories.has('flower')).toBe(true);
    expect(categories.has('tree')).toBe(true);
  });

  it('every plant has at least one activity', () => {
    DEFAULT_PLANTS.forEach(plant => {
      expect(plant.activities.length).toBeGreaterThan(0);
    });
  });

  it('every activity has startMonth and endMonth in range 0-23', () => {
    DEFAULT_PLANTS.forEach(plant => {
      plant.activities.forEach(activity => {
        expect(activity.startMonth).toBeGreaterThanOrEqual(0);
        expect(activity.startMonth).toBeLessThanOrEqual(23);
        expect(activity.endMonth).toBeGreaterThanOrEqual(0);
        expect(activity.endMonth).toBeLessThanOrEqual(23);
      });
    });
  });

  it('every activity has startMonth <= endMonth', () => {
    DEFAULT_PLANTS.forEach(plant => {
      plant.activities.forEach(activity => {
        expect(activity.startMonth).toBeLessThanOrEqual(activity.endMonth);
      });
    });
  });

  it('every activity type is from the known domain types', () => {
    DEFAULT_PLANTS.forEach(plant => {
      plant.activities.forEach(activity => {
        expect(VALID_ACTIVITY_TYPES).toContain(activity.type);
      });
    });
  });

  it('every activity color is a valid 6-digit hex color', () => {
    DEFAULT_PLANTS.forEach(plant => {
      plant.activities.forEach(activity => {
        expect(activity.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  it('every activity has a non-empty label', () => {
    DEFAULT_PLANTS.forEach(plant => {
      plant.activities.forEach(activity => {
        expect(activity.label).toBeTruthy();
      });
    });
  });

  it('every activity id is a non-empty string', () => {
    DEFAULT_PLANTS.forEach(plant => {
      plant.activities.forEach(activity => {
        expect(typeof activity.id).toBe('string');
        expect(activity.id).toBeTruthy();
      });
    });
  });
});
