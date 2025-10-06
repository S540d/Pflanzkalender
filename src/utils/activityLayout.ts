import { Activity } from '../types';

export interface ActivityWithRow extends Activity {
  row: number;
}

// Prüft ob sich zwei Aktivitäten überlappen
const overlaps = (a: Activity, b: Activity): boolean => {
  return !(a.endMonth < b.startMonth || b.endMonth < a.startMonth);
};

// Berechnet kompakte Zeilen für Aktivitäten
export const calculateActivityRows = (activities: Activity[]): ActivityWithRow[] => {
  if (activities.length === 0) return [];

  // Sortiere nach Startmonat
  const sorted = [...activities].sort((a, b) => a.startMonth - b.startMonth);
  const result: ActivityWithRow[] = [];
  const rows: Activity[][] = [];

  for (const activity of sorted) {
    // Finde erste Zeile, in der die Aktivität passt
    let targetRow = 0;
    let placed = false;

    for (let i = 0; i < rows.length; i++) {
      const rowActivities = rows[i];
      const hasOverlap = rowActivities.some(a => overlaps(a, activity));

      if (!hasOverlap) {
        rows[i].push(activity);
        targetRow = i;
        placed = true;
        break;
      }
    }

    // Wenn keine passende Zeile gefunden, erstelle neue
    if (!placed) {
      rows.push([activity]);
      targetRow = rows.length - 1;
    }

    result.push({ ...activity, row: targetRow });
  }

  return result;
};
