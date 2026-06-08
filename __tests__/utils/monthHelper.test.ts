import {
  halfMonthToString,
  halfMonthRangeToString,
  clampActivityShift,
  MONTH_SHORT,
} from '../../src/utils/monthHelper';

describe('halfMonthToString', () => {
  it('returns "Jan 1" for index 0', () => {
    expect(halfMonthToString(0)).toBe('Jan 1');
  });

  it('returns "Jan 2" for index 1', () => {
    expect(halfMonthToString(1)).toBe('Jan 2');
  });

  it('returns "Feb 1" for index 2', () => {
    expect(halfMonthToString(2)).toBe('Feb 1');
  });

  it('returns "Dez 1" for index 22', () => {
    expect(halfMonthToString(22)).toBe('Dez 1');
  });

  it('returns "Dez 2" for index 23 (last half-month)', () => {
    expect(halfMonthToString(23)).toBe('Dez 2');
  });

  it('returns correct first-half label for every month', () => {
    MONTH_SHORT.forEach((short, i) => {
      expect(halfMonthToString(i * 2)).toBe(`${short} 1`);
    });
  });

  it('returns correct second-half label for every month', () => {
    MONTH_SHORT.forEach((short, i) => {
      expect(halfMonthToString(i * 2 + 1)).toBe(`${short} 2`);
    });
  });
});

describe('halfMonthRangeToString', () => {
  it('returns only the month name when start and end are in the same month', () => {
    expect(halfMonthRangeToString(0, 1)).toBe('Jan');
  });

  it('returns "Jan" for range 0-0 (same half)', () => {
    expect(halfMonthRangeToString(0, 0)).toBe('Jan');
  });

  it('returns "Jan - Mär" for index 0 to 5', () => {
    expect(halfMonthRangeToString(0, 5)).toBe('Jan - Mär');
  });

  it('returns "Jan - Dez" for full year (0-23)', () => {
    expect(halfMonthRangeToString(0, 23)).toBe('Jan - Dez');
  });

  it('returns adjacent months correctly (Feb - Mär for 2-4)', () => {
    expect(halfMonthRangeToString(2, 4)).toBe('Feb - Mär');
  });

  it('returns correct label for same-month range crossing halves (Jul 1 - Jul 2)', () => {
    // index 12 = Jul 1, index 13 = Jul 2 → same month
    expect(halfMonthRangeToString(12, 13)).toBe('Jul');
  });
});

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
