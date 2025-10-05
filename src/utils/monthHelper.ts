// Hilfsfunktionen für Monatsberechnungen

export const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
];

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
