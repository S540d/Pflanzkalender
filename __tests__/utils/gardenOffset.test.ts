import {
  applyGardenOffset,
  clampGardenOffset,
  gardenOffsetLabelKey,
  shiftActivityByOffset,
  shiftRangeByOffset,
} from '../../src/utils/gardenOffset';
import type { Activity, Plant } from '../../src/types';

const activity = (startMonth: number, endMonth: number): Activity => ({
  id: 'a',
  type: 'sow',
  startMonth,
  endMonth,
  color: '#000',
  label: 'Aussäen',
});

describe('clampGardenOffset', () => {
  it('begrenzt auf −2…+2, rundet und fängt ungültige Werte ab', () => {
    expect(clampGardenOffset(5)).toBe(2);
    expect(clampGardenOffset(-9)).toBe(-2);
    expect(clampGardenOffset(1.4)).toBe(1);
    expect(clampGardenOffset(NaN)).toBe(0);
    expect(clampGardenOffset(Infinity)).toBe(0);
  });
});

describe('shiftRangeByOffset', () => {
  it('verschiebt Start und Ende gleichmäßig (Dauer bleibt)', () => {
    expect(shiftRangeByOffset(4, 8, 2)).toEqual({ startMonth: 6, endMonth: 10 });
    expect(shiftRangeByOffset(4, 8, -1)).toEqual({ startMonth: 3, endMonth: 7 });
  });

  it('stoppt am Jahresrand, ohne zu kürzen oder zu wrappen', () => {
    expect(shiftRangeByOffset(0, 3, -2)).toEqual({ startMonth: 0, endMonth: 3 });
    expect(shiftRangeByOffset(20, 22, 2)).toEqual({ startMonth: 21, endMonth: 23 });
    expect(shiftRangeByOffset(23, 23, 2)).toEqual({ startMonth: 23, endMonth: 23 });
  });
});

describe('shiftActivityByOffset / applyGardenOffset', () => {
  const plant: Plant = {
    id: 'p1',
    name: 'Tomaten',
    isDefault: false,
    userId: null,
    activities: [activity(4, 8)],
    notes: '',
    createdAt: 1,
    updatedAt: 1,
  };

  it('gibt bei Offset 0 dieselben Referenzen zurück', () => {
    const a = activity(4, 8);
    expect(shiftActivityByOffset(a, 0)).toBe(a);
    const plants = [plant];
    expect(applyGardenOffset(plants, 0)).toBe(plants);
  });

  it('verändert das Original nicht (nur Darstellung)', () => {
    const shifted = applyGardenOffset([plant], 2);
    expect(shifted[0].activities[0]).toMatchObject({ id: 'a', startMonth: 6, endMonth: 10 });
    expect(plant.activities[0]).toMatchObject({ startMonth: 4, endMonth: 8 });
  });
});

describe('gardenOffsetLabelKey', () => {
  it('bildet Offsets auf i18n-Schlüssel ab', () => {
    expect(gardenOffsetLabelKey(-2)).toBe('settings.gardenOffset.m2');
    expect(gardenOffsetLabelKey(-1)).toBe('settings.gardenOffset.m1');
    expect(gardenOffsetLabelKey(0)).toBe('settings.gardenOffset.0');
    expect(gardenOffsetLabelKey(1)).toBe('settings.gardenOffset.p1');
    expect(gardenOffsetLabelKey(2)).toBe('settings.gardenOffset.p2');
    expect(gardenOffsetLabelKey(7)).toBe('settings.gardenOffset.p2');
  });
});
