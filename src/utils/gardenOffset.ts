import type { Activity, Plant } from '../types';
import { clampActivityShift } from './monthHelper';

/**
 * Regionaler Zeitversatz („Mein Garten ist früher/später dran"), in Halbmonaten.
 * Positiv = später, negativ = früher. Wirkt NUR auf die Darstellung – gespeicherte
 * Aktivitäten werden nie verändert.
 */
export const GARDEN_OFFSET_MIN = -2;
export const GARDEN_OFFSET_MAX = 2;
export const GARDEN_OFFSET_OPTIONS = [-2, -1, 0, 1, 2] as const;

export function clampGardenOffset(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(GARDEN_OFFSET_MIN, Math.min(GARDEN_OFFSET_MAX, Math.round(value)));
}

/**
 * Verschiebt einen Zeitraum um `offset` Halbmonate und behält dabei die Dauer bei.
 * Am Jahresrand stoppt die Verschiebung (clampActivityShift), statt zu wrappen oder
 * den Zeitraum zu kürzen.
 */
export function shiftRangeByOffset(
  startMonth: number,
  endMonth: number,
  offset: number
): { startMonth: number; endMonth: number } {
  const delta = clampActivityShift(startMonth, endMonth, offset);
  return { startMonth: startMonth + delta, endMonth: endMonth + delta };
}

export function shiftActivityByOffset(activity: Activity, offset: number): Activity {
  if (offset === 0) return activity;
  return { ...activity, ...shiftRangeByOffset(activity.startMonth, activity.endMonth, offset) };
}

/** Liefert Pflanzen mit verschobenen Aktivitäten (gleiche IDs). Bei offset 0 dieselbe Referenz. */
export function applyGardenOffset(plants: Plant[], offset: number): Plant[] {
  if (offset === 0) return plants;
  return plants.map((plant) => ({
    ...plant,
    activities: plant.activities.map((a) => shiftActivityByOffset(a, offset)),
  }));
}

/** i18n-Schlüssel der Beschriftung eines Versatzes („settings.gardenOffset.m1" …). */
export function gardenOffsetLabelKey(offset: number): string {
  const o = clampGardenOffset(offset);
  const suffix = o === 0 ? '0' : o < 0 ? `m${-o}` : `p${o}`;
  return `settings.gardenOffset.${suffix}`;
}
