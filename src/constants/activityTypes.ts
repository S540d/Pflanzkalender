import type { IconName } from '../components/ui/Icon';

export interface ActivityType {
  type: string;
  color: string;
  label: string;
  /** Semantisches Icon (siehe Icon-Mapping) – für Bars, Agenda, Picker. */
  icon: IconName;
}

// Gedämpfte, erdige Palette passend zur Markenpalette (brandPalette.ts).
export const ACTIVITY_TYPES: ActivityType[] = [
  { type: 'sow', color: '#7A5A3A', label: 'Aussäen', icon: 'sow' }, // Erde
  { type: 'plant', color: '#4E8F5E', label: 'Pflanzen', icon: 'plantAction' }, // Blattgrün
  { type: 'fertilize', color: '#C99A2E', label: 'Düngen', icon: 'fertilize' }, // Ocker
  { type: 'water', color: '#4F86A6', label: 'Gießen', icon: 'water' }, // Wasserblau
  { type: 'prune', color: '#7E8F3E', label: 'Zurückschneiden', icon: 'prune' }, // Oliv
  { type: 'harvest', color: '#C4513D', label: 'Ernten', icon: 'harvest' }, // Terrakotta
  { type: 'protect', color: '#7C6A9E', label: 'Winterschutz', icon: 'protect' }, // Gedecktes Violett
  { type: 'mulch', color: '#B58A5A', label: 'Mulchen', icon: 'mulch' }, // Rinde
];

export const getActivityTypeByType = (type: string): ActivityType | undefined => {
  return ACTIVITY_TYPES.find((at) => at.type === type);
};

/**
 * Anzeigefarbe einer Aktivität: immer die aktuelle Farbe ihres Typs, damit
 * Palettenänderungen auch gespeicherte Aktivitäten erreichen (keine Migration nötig).
 * Die gespeicherte `color` bleibt Fallback für unbekannte Typen.
 */
export const getActivityColor = (activity: { type: string; color: string }): string =>
  getActivityTypeByType(activity.type)?.color ?? activity.color;
