import {
  ACTIVITY_TYPES,
  getActivityColor,
  getActivityTypeByType,
} from '../../src/constants/activityTypes';

describe('ACTIVITY_TYPES', () => {
  it('contains exactly 8 activity types', () => {
    expect(ACTIVITY_TYPES).toHaveLength(8);
  });

  it('every entry has a non-empty type, color, and label', () => {
    ACTIVITY_TYPES.forEach(({ type, color, label }) => {
      expect(type).toBeTruthy();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(label).toBeTruthy();
    });
  });

  it('all type values are unique', () => {
    const types = ACTIVITY_TYPES.map((a) => a.type);
    expect(new Set(types).size).toBe(types.length);
  });

  it('contains all required domain types', () => {
    const types = ACTIVITY_TYPES.map((a) => a.type);
    expect(types).toContain('sow');
    expect(types).toContain('plant');
    expect(types).toContain('fertilize');
    expect(types).toContain('water');
    expect(types).toContain('prune');
    expect(types).toContain('harvest');
    expect(types).toContain('protect');
    expect(types).toContain('mulch');
  });
});

describe('getActivityTypeByType', () => {
  it('returns the correct entry for "sow"', () => {
    const result = getActivityTypeByType('sow');
    expect(result).toBeDefined();
    expect(result!.label).toBe('Aussäen');
    expect(result!.color).toBe('#7A5A3A');
  });

  it('returns the correct entry for "harvest"', () => {
    const result = getActivityTypeByType('harvest');
    expect(result).toBeDefined();
    expect(result!.color).toBe('#C4513D');
  });

  it('returns undefined for an unknown type', () => {
    expect(getActivityTypeByType('unknown')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(getActivityTypeByType('')).toBeUndefined();
  });

  it('is case-sensitive (uppercase does not match)', () => {
    expect(getActivityTypeByType('SOW')).toBeUndefined();
  });
});

describe('getActivityColor', () => {
  it('uses the current type color instead of the stored one', () => {
    expect(getActivityColor({ type: 'harvest', color: '#DC143C' })).toBe('#C4513D');
  });

  it('falls back to the stored color for unknown types', () => {
    expect(getActivityColor({ type: 'custom', color: '#123456' })).toBe('#123456');
  });
});
