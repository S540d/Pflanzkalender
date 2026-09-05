import { Activity } from '../types';

export interface ActivityWithRow extends Activity {
  row: number;
}

// Vertikaler Abstand pro Aktivitäts-Zeile. Muss zwischen der fixen Namensspalte
// (PlantRowsContainer) und den scrollbaren Aktivitäts-Zeilen (PlantRow) identisch
// sein, sonst laufen die Zeilenhöhen beider Spalten auseinander und die manuell
// synchronisierten ScrollViews driften beim Scrollen auseinander (Issue #260).
export const ROW_STRIDE = 34;
const BASE_ROW_MIN_HEIGHT = 64;

// Berechnet die Mindesthöhe einer Pflanzen-Zeile aus den (bereits nach Zeilen
// aufgeteilten) Aktivitäten – einheitlich für Namensspalte und Aktivitätsspalte.
export const calculateRowMinHeight = (activitiesWithRows: ActivityWithRow[]): number => {
  const maxRow = activitiesWithRows.reduce((max, a) => Math.max(max, a.row), 0);
  return Math.max(BASE_ROW_MIN_HEIGHT, (maxRow + 1) * ROW_STRIDE + 8);
};

// Konvertiert Activities für Portrait-Modus (24 Halbmonate → 6 Slots à 4 Halbmonate)
export const convertActivitiesToPortraitSlots = (activities: Activity[]): Activity[] => {
  return activities.map((activity) => ({
    ...activity,
    startMonth: Math.floor(activity.startMonth / 4),
    endMonth: Math.floor(activity.endMonth / 4),
  }));
};

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
      const hasOverlap = rowActivities.some((a) => overlaps(a, activity));

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
