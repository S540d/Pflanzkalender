import {
  getCompletion,
  isValidIsoDate,
  toIsoDate,
  yearForHalfMonthOffset,
} from '../../src/utils/completions';

describe('toIsoDate', () => {
  it('formatiert lokales Datum zweistellig', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toIsoDate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('isValidIsoDate', () => {
  it('akzeptiert existierende Kalendertage', () => {
    expect(isValidIsoDate('2026-02-28')).toBe(true);
    expect(isValidIsoDate('2028-02-29')).toBe(true);
  });

  it('lehnt falsches Format und nicht existierende Tage ab', () => {
    expect(isValidIsoDate('2026-2-28')).toBe(false);
    expect(isValidIsoDate('28.02.2026')).toBe(false);
    expect(isValidIsoDate('2026-02-30')).toBe(false);
    expect(isValidIsoDate('2027-02-29')).toBe(false);
    expect(isValidIsoDate('2026-13-01')).toBe(false);
    expect(isValidIsoDate('')).toBe(false);
  });
});

describe('getCompletion', () => {
  it('liefert den Eintrag des Jahres oder undefined', () => {
    const activity = { completions: { '2026': { date: '2026-03-01', note: 'x' } } };
    expect(getCompletion(activity, 2026)).toEqual({ date: '2026-03-01', note: 'x' });
    expect(getCompletion(activity, 2025)).toBeUndefined();
    expect(getCompletion({}, 2026)).toBeUndefined();
  });
});

describe('yearForHalfMonthOffset', () => {
  it('bleibt im Jahr innerhalb 0–23', () => {
    expect(yearForHalfMonthOffset(2026, 10, 5)).toBe(2026);
    expect(yearForHalfMonthOffset(2026, 0, 0)).toBe(2026);
  });

  it('läuft über den Jahreswechsel vorwärts und rückwärts', () => {
    expect(yearForHalfMonthOffset(2026, 22, 2)).toBe(2027);
    expect(yearForHalfMonthOffset(2026, 23, 1)).toBe(2027);
    expect(yearForHalfMonthOffset(2026, 0, -1)).toBe(2025);
    expect(yearForHalfMonthOffset(2026, 1, -1)).toBe(2026);
  });
});
