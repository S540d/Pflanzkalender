import { clampActivityShift } from '../../src/utils/monthHelper';

describe('clampActivityShift (Drag & Drop, Issue #142)', () => {
  it('applies the full delta when within bounds', () => {
    expect(clampActivityShift(4, 8, 3)).toBe(3);
    expect(clampActivityShift(4, 8, -2)).toBe(-2);
  });

  it('clamps a positive shift so the end never exceeds 23', () => {
    // end at 20, max +3 allowed
    expect(clampActivityShift(18, 20, 10)).toBe(3);
  });

  it('clamps a negative shift so the start never goes below 0', () => {
    // start at 2, max -2 allowed
    expect(clampActivityShift(2, 6, -10)).toBe(-2);
  });

  it('returns 0 when the activity already touches a boundary', () => {
    expect(clampActivityShift(0, 5, -4)).toBe(0);
    expect(clampActivityShift(18, 23, 4)).toBe(0);
  });

  it('keeps a full-year activity (0-23) fixed', () => {
    expect(clampActivityShift(0, 23, 5)).toBe(0);
    expect(clampActivityShift(0, 23, -5)).toBe(0);
  });
});
