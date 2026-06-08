// Hilfsfunktionen für Monatsberechnungen

export const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
];

export const HALF_MONTH_NAMES = [
  'Jan 1-15',
  'Jan 16-31',
  'Feb 1-15',
  'Feb 16-28',
  'Mär 1-15',
  'Mär 16-31',
  'Apr 1-15',
  'Apr 16-30',
  'Mai 1-15',
  'Mai 16-31',
  'Jun 1-15',
  'Jun 16-30',
  'Jul 1-15',
  'Jul 16-31',
  'Aug 1-15',
  'Aug 16-31',
  'Sep 1-15',
  'Sep 16-30',
  'Okt 1-15',
  'Okt 16-31',
  'Nov 1-15',
  'Nov 16-30',
  'Dez 1-15',
  'Dez 16-31',
];

// Höchster gültiger Halbmonats-Index (0 = Jan 1. Hälfte … 23 = Dez 2. Hälfte)
export const HALF_MONTH_MAX = 23;

// Begrenzt eine Verschiebung (Delta in Halbmonaten) so, dass die Aktivität
// vollständig im gültigen Bereich [0, 23] bleibt. Gibt das anwendbare Delta
// zurück (kann 0 sein, wenn die Aktivität bereits am Rand liegt).
// Genutzt für Drag & Drop von Aktivitätsbalken (Issue #142).
export const clampActivityShift = (startMonth: number, endMonth: number, delta: number): number => {
  const minDelta = -startMonth;
  const maxDelta = HALF_MONTH_MAX - endMonth;
  const result = Math.max(minDelta, Math.min(maxDelta, delta));
  // Normalisiere -0 → 0
  return result === 0 ? 0 : result;
};

// Konvertiere halbe Monats-Index zu lesbarem String
// 0 = Jan 1. Hälfte, 1 = Jan 2. Hälfte, 2 = Feb 1. Hälfte, etc.
export const halfMonthToString = (halfMonthIndex: number): string => {
  const monthIndex = Math.floor(halfMonthIndex / 2);
  const isFirstHalf = halfMonthIndex % 2 === 0;
  return `${MONTH_SHORT[monthIndex]} ${isFirstHalf ? '1' : '2'}`;
};

// Konvertiere Bereich zu String
export const halfMonthRangeToString = (start: number, end: number): string => {
  const startMonth = Math.floor(start / 2);
  const endMonth = Math.floor(end / 2);

  if (startMonth === endMonth) {
    return MONTH_SHORT[startMonth];
  }

  return `${MONTH_SHORT[startMonth]} - ${MONTH_SHORT[endMonth]}`;
};
