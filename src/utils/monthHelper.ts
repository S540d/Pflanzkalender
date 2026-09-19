// Hilfsfunktionen für Monatsberechnungen

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

// Höchster gültiger Halbmonats-Index (0 = Jan 1. Hälfte … 23 = Dez 2. Hälfte)
export const HALF_MONTH_MAX = 23;

/**
 * Begrenzt eine Verschiebung so, dass die Aktivität vollständig im gültigen
 * Bereich [0, 23] bleibt. Genutzt für Drag & Drop von Aktivitätsbalken (Issue #142).
 *
 * Alle Werte sind **Halbmonats-Indizes/-Deltas** (nicht Pixel oder Monate):
 * @param startMonth Aktueller Startmonat der Aktivität (Halbmonats-Index 0–23)
 * @param endMonth   Aktueller Endmonat der Aktivität (Halbmonats-Index 0–23)
 * @param delta      Gewünschte Verschiebung in Halbmonaten (positiv = später)
 * @returns Das tatsächlich anwendbare Delta in Halbmonaten (0, wenn am Rand)
 */
export const clampActivityShift = (startMonth: number, endMonth: number, delta: number): number => {
  const minDelta = -startMonth;
  const maxDelta = HALF_MONTH_MAX - endMonth;
  const result = Math.max(minDelta, Math.min(maxDelta, delta));
  // Normalisiere -0 → 0
  return result === 0 ? 0 : result;
};
