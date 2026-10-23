import { getActivityColor, getActivityTypeByType } from '../constants/activityTypes';
import { getPlantEmoji } from '../constants/plantEmojis';
import { getPlantDisplayName, getPlantDisplayNotes } from '../constants/plantNames';
import type { ActivityCompletion, Plant } from '../types';
import type { Language } from '../contexts/LanguageContext';
import type { TranslationValue } from '../i18n';
import type { IconName } from '../components/ui';
import { getActivityDisplayLabel } from './activityLabel';
import { getCompletion } from './completions';

export interface ActivityInfo {
  plantId: string;
  activityId: string;
  year: number;
  completion?: ActivityCompletion;
  plantName: string;
  plantEmoji: string;
  activityLabel: string;
  activityColor: string;
  activityIcon?: IconName;
  notes?: string;
}

/** Aktueller Halbmonat (0–23): 0 = Jan 1. Hälfte, 23 = Dez 2. Hälfte. */
export function currentHalfMonthIndex(now: Date = new Date()): number {
  return now.getMonth() * 2 + (now.getDate() <= 15 ? 0 : 1);
}

/**
 * Alle Aktivitäten, die im gegebenen Halbmonat laufen, nach Pflanzenname sortiert.
 * `plants` ist bereits mit Garten-Zeitversatz aufbereitet (siehe `applyGardenOffset`).
 */
export function getHalfMonthActivities(
  plants: Plant[],
  monthIndex: number,
  year: number,
  language: Language,
  t: (key: string) => TranslationValue | string
): ActivityInfo[] {
  const activities: ActivityInfo[] = [];
  plants.forEach((plant) => {
    plant.activities.forEach((activity) => {
      if (activity.startMonth <= monthIndex && activity.endMonth >= monthIndex) {
        activities.push({
          plantId: plant.id,
          activityId: activity.id,
          year,
          completion: getCompletion(activity, year),
          plantName: getPlantDisplayName(plant.name, language),
          plantEmoji: getPlantEmoji(plant.name, plant.category),
          activityLabel: getActivityDisplayLabel(activity, t),
          activityColor: getActivityColor(activity),
          activityIcon: getActivityTypeByType(activity.type)?.icon,
          notes: getPlantDisplayNotes(plant.name, plant.notes, language),
        });
      }
    });
  });
  return activities.sort((a, b) => a.plantName.localeCompare(b.plantName, language));
}
