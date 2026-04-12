import {
  PLANT_LOCATION_METADATA,
  PLANT_CATEGORY_METADATA,
} from '../../src/constants/plantMetadata';
import type { PlantLocation, PlantCategory } from '../../src/types';

describe('PLANT_LOCATION_METADATA', () => {
  const EXPECTED_LOCATIONS: PlantLocation[] = ['sun', 'partial-shade', 'shade'];

  it('has entries for all three location types', () => {
    EXPECTED_LOCATIONS.forEach(loc => {
      expect(PLANT_LOCATION_METADATA[loc]).toBeDefined();
    });
  });

  it('every entry has non-empty de, en, and icon fields', () => {
    EXPECTED_LOCATIONS.forEach(loc => {
      const meta = PLANT_LOCATION_METADATA[loc];
      expect(meta.de).toBeTruthy();
      expect(meta.en).toBeTruthy();
      expect(meta.icon).toBeTruthy();
    });
  });

  it('"sun" maps to german "Sonne"', () => {
    expect(PLANT_LOCATION_METADATA.sun.de).toBe('Sonne');
  });

  it('"partial-shade" maps to english "Partial Shade"', () => {
    expect(PLANT_LOCATION_METADATA['partial-shade'].en).toBe('Partial Shade');
  });
});

describe('PLANT_CATEGORY_METADATA', () => {
  const EXPECTED_CATEGORIES: PlantCategory[] = ['vegetable', 'flower', 'tree'];

  it('has entries for all three category types', () => {
    EXPECTED_CATEGORIES.forEach(cat => {
      expect(PLANT_CATEGORY_METADATA[cat]).toBeDefined();
    });
  });

  it('every entry has non-empty de, en, and icon fields', () => {
    EXPECTED_CATEGORIES.forEach(cat => {
      const meta = PLANT_CATEGORY_METADATA[cat];
      expect(meta.de).toBeTruthy();
      expect(meta.en).toBeTruthy();
      expect(meta.icon).toBeTruthy();
    });
  });

  it('"vegetable" maps to german "Nutzpflanze"', () => {
    expect(PLANT_CATEGORY_METADATA.vegetable.de).toBe('Nutzpflanze');
  });

  it('"tree" maps to english "Tree"', () => {
    expect(PLANT_CATEGORY_METADATA.tree.en).toBe('Tree');
  });
});
