import type { Activity, ActivityCompletion } from '../types';

export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Lokales Datum als YYYY-MM-DD (nicht UTC, damit „heute" zur Nutzer-Zeitzone passt). */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Strikte Prüfung auf ein existierendes Kalenderdatum im Format YYYY-MM-DD. */
export function isValidIsoDate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

export function getCompletion(
  activity: Pick<Activity, 'completions'>,
  year: number
): ActivityCompletion | undefined {
  return activity.completions?.[String(year)];
}

/**
 * Jahr eines Agenda-Halbmonats relativ zum aktuellen Halbmonat.
 * `offset` kann über den Jahreswechsel laufen (z. B. Dez 2. Hälfte + 1 → Jan Folgejahr).
 */
export function yearForHalfMonthOffset(
  currentYear: number,
  currentHalfMonth: number,
  offset: number
): number {
  return currentYear + Math.floor((currentHalfMonth + offset) / 24);
}
