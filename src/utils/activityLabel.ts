import type { Activity } from '../types';
import type { TranslationValue } from '../i18n';

/**
 * Default (non-customized) activities ship with a German label baked in
 * (see defaultPlants.ts / activityTypes.ts). Re-derive the label from the
 * activity type via i18n so it matches the current language; a
 * user-customized label (isCustomized: true) is shown as typed.
 */
export function getActivityDisplayLabel(
  activity: Pick<Activity, 'type' | 'label' | 'isCustomized'>,
  t: (key: string) => TranslationValue | string
): string {
  if (activity.isCustomized) return activity.label;
  const translated = t(`activity.type.${activity.type}`);
  return typeof translated === 'string' && translated !== `activity.type.${activity.type}`
    ? translated
    : activity.label;
}
