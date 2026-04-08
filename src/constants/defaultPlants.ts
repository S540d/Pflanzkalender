import { Plant, PlantLocation, PlantCategory } from '../types';

// Hilfsfunktion zum Erstellen von Aktivitäten
const createActivity = (type: string, startMonth: number, endMonth: number, color: string, label: string) => ({
  id: `${type}-${startMonth}-${endMonth}`,
  type,
  startMonth,
  endMonth,
  color,
  label,
});

const v = 'vegetable' as PlantCategory;
const f = 'flower' as PlantCategory;
const t = 'tree' as PlantCategory;

export const DEFAULT_PLANTS: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Tomaten',
    isDefault: true,
    userId: null,
    notes: 'Beliebtes Gemüse für Garten und Balkon',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 3, 5, '#8B4513', 'Aussäen'), // Feb-März
      createActivity('plant', 9, 9, '#228B22', 'Pflanzen'), // Mai
      createActivity('fertilize', 11, 17, '#FFD700', 'Düngen'), // Jun-Sep
      createActivity('harvest', 13, 19, '#DC143C', 'Ernten'), // Jul-Okt
    ],
  },
  {
    name: 'Erdbeeren',
    isDefault: true,
    userId: null,
    notes: 'Mehrjährige Pflanze',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('plant', 15, 17, '#228B22', 'Pflanzen'), // Aug-Sep
      createActivity('harvest', 9, 13, '#DC143C', 'Ernten'), // Mai-Jul
      createActivity('fertilize', 5, 7, '#FFD700', 'Düngen'), // März-Apr
    ],
  },
  {
    name: 'Salat',
    isDefault: true,
    userId: null,
    notes: 'Schnell wachsend',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 5, 15, '#8B4513', 'Aussäen'), // März-Aug
      createActivity('harvest', 9, 19, '#DC143C', 'Ernten'), // Mai-Okt
    ],
  },
  {
    name: 'Karotten',
    isDefault: true,
    userId: null,
    notes: 'Wurzelgemüse',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 5, 13, '#8B4513', 'Aussäen'), // März-Jul
      createActivity('harvest', 13, 21, '#DC143C', 'Ernten'), // Jul-Nov
    ],
  },
  {
    name: 'Rosen',
    isDefault: true,
    userId: null,
    notes: 'Zierpflanze',
    location: 'sun' as PlantLocation,
    category: f,
    activities: [
      createActivity('prune', 4, 5, '#FFEB3B', 'Zurückschneiden'), // März (Frühjahr)
      createActivity('fertilize', 7, 15, '#FFD700', 'Düngen'), // Apr-Aug
      createActivity('prune', 19, 20, '#FFEB3B', 'Zurückschneiden'), // Okt (Herbst)
      createActivity('protect', 21, 23, '#9370DB', 'Winterschutz'), // Nov-Dez
    ],
  },
  {
    name: 'Paprika',
    isDefault: true,
    userId: null,
    notes: 'Wärmeliebendes Gemüse',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 3, 5, '#8B4513', 'Aussäen'), // Feb-März
      createActivity('plant', 9, 11, '#228B22', 'Pflanzen'), // Mai-Jun
      createActivity('harvest', 15, 19, '#DC143C', 'Ernten'), // Aug-Okt
    ],
  },
  {
    name: 'Zucchini',
    isDefault: true,
    userId: null,
    notes: 'Ertragreiche Kürbispflanze',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 7, 9, '#8B4513', 'Aussäen'), // Apr-Mai
      createActivity('plant', 9, 11, '#228B22', 'Pflanzen'), // Mai-Jun
      createActivity('harvest', 13, 17, '#DC143C', 'Ernten'), // Jul-Sep
    ],
  },
  {
    name: 'Gurken',
    isDefault: true,
    userId: null,
    notes: 'Kletterpflanze',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 7, 9, '#8B4513', 'Aussäen'), // Apr-Mai
      createActivity('plant', 9, 11, '#228B22', 'Pflanzen'), // Mai-Jun
      createActivity('harvest', 13, 17, '#DC143C', 'Ernten'), // Jul-Sep
    ],
  },
  {
    name: 'Radieschen',
    isDefault: true,
    userId: null,
    notes: 'Schnellwachsend',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 5, 17, '#8B4513', 'Aussäen'), // März-Sep
      createActivity('harvest', 7, 19, '#DC143C', 'Ernten'), // Apr-Okt
    ],
  },
  {
    name: 'Basilikum',
    isDefault: true,
    userId: null,
    notes: 'Beliebtes Küchenkraut',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 7, 9, '#8B4513', 'Aussäen'), // Apr-Mai
      createActivity('harvest', 11, 17, '#DC143C', 'Ernten'), // Jun-Sep
    ],
  },
  {
    name: 'Kürbis',
    isDefault: true,
    userId: null,
    notes: 'Große Früchte',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 7, 9, '#8B4513', 'Aussäen'), // Apr-Mai
      createActivity('plant', 9, 11, '#228B22', 'Pflanzen'), // Mai-Jun
      createActivity('harvest', 17, 19, '#DC143C', 'Ernten'), // Sep-Okt
    ],
  },
  {
    name: 'Kartoffeln',
    isDefault: true,
    userId: null,
    notes: 'Grundnahrungsmittel',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('plant', 5, 9, '#228B22', 'Pflanzen'), // März-Mai
      createActivity('harvest', 13, 17, '#DC143C', 'Ernten'), // Jul-Sep
    ],
  },
  {
    name: 'Zwiebeln',
    isDefault: true,
    userId: null,
    notes: 'Lagerfähig',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('plant', 5, 7, '#228B22', 'Steckzwiebeln'), // März-Apr
      createActivity('harvest', 13, 15, '#DC143C', 'Ernten'), // Jul-Aug
    ],
  },
  {
    name: 'Knoblauch',
    isDefault: true,
    userId: null,
    notes: 'Herbstpflanzung',
    location: 'sun' as PlantLocation,
    category: v,
    activities: [
      createActivity('plant', 17, 21, '#228B22', 'Pflanzen'), // Sep-Nov
      createActivity('harvest', 11, 13, '#DC143C', 'Ernten'), // Jun-Jul
    ],
  },
  {
    name: 'Himbeeren',
    isDefault: true,
    userId: null,
    notes: 'Beerenobst',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('prune', 3, 5, '#FFEB3B', 'Zurückschneiden'), // Feb-März (Frühjahr)
      createActivity('fertilize', 5, 7, '#FFD700', 'Düngen'), // März-Apr
      createActivity('harvest', 11, 15, '#DC143C', 'Ernten'), // Jun-Aug
      createActivity('prune', 17, 19, '#FFEB3B', 'Zurückschneiden'), // Sep-Okt (Herbst, alte Ruten)
    ],
  },
  {
    name: 'Lavendel',
    isDefault: true,
    userId: null,
    notes: 'Duftpflanze',
    location: 'sun' as PlantLocation,
    category: f,
    activities: [
      createActivity('prune', 5, 7, '#FFEB3B', 'Zurückschneiden'), // März-Apr (Frühjahr)
      createActivity('harvest', 11, 13, '#DC143C', 'Blüten ernten'), // Jun-Jul
      createActivity('prune', 15, 17, '#FFEB3B', 'Zurückschneiden'), // Aug-Sep (nach Blüte)
    ],
  },
  {
    name: 'Petersilie',
    isDefault: true,
    userId: null,
    notes: 'Zweijähriges Kraut',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 5, 13, '#8B4513', 'Aussäen'), // März-Jul
      createActivity('harvest', 9, 21, '#DC143C', 'Ernten'), // Mai-Nov
    ],
  },
  {
    name: 'Schnittlauch',
    isDefault: true,
    userId: null,
    notes: 'Mehrjährig',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 5, 9, '#8B4513', 'Aussäen'), // März-Mai
      createActivity('harvest', 7, 19, '#DC143C', 'Ernten'), // Apr-Okt
    ],
  },
  {
    name: 'Spinat',
    isDefault: true,
    userId: null,
    notes: 'Frühjahrs- und Herbstanbau',
    location: 'partial-shade' as PlantLocation,
    category: v,
    activities: [
      createActivity('sow', 3, 9, '#8B4513', 'Aussäen'), // Feb-Mai
      createActivity('sow', 15, 17, '#8B4513', 'Aussäen'), // Aug-Sep
      createActivity('harvest', 7, 11, '#DC143C', 'Ernten'), // Apr-Jun
      createActivity('harvest', 17, 21, '#DC143C', 'Ernten'), // Sep-Nov
    ],
  },
  {
    name: 'Apfelbaum',
    isDefault: true,
    userId: null,
    notes: 'Obstbaum',
    location: 'sun' as PlantLocation,
    category: t,
    activities: [
      createActivity('prune', 1, 5, '#FFEB3B', 'Zurückschneiden'), // Jan-März (Winterschnitt)
      createActivity('fertilize', 5, 7, '#FFD700', 'Düngen'), // März-Apr
      createActivity('harvest', 15, 19, '#DC143C', 'Ernten'), // Aug-Okt
    ],
  },
];
