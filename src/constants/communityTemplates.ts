import { Plant } from '../types';

type TemplatePlant = Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>;

export interface CommunityTemplate {
  id: string;
  name: { de: string; en: string };
  description: { de: string; en: string };
  icon: string;
  plants: TemplatePlant[];
}

const act = (type: string, start: number, end: number, color: string, label: string) => ({
  id: `${type}-${start}-${end}`,
  type,
  startMonth: start,
  endMonth: end,
  color,
  label,
});

export const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    id: 'balkon-starter',
    name: { de: 'Balkon-Garten Starter', en: 'Balcony Garden Starter' },
    description: {
      de: '5 Pflanzen perfekt für Balkon und Terrasse',
      en: '5 plants perfect for balcony and patio',
    },
    icon: '🌿',
    plants: [
      {
        name: 'Tomaten',
        isDefault: false,
        userId: null,
        notes: 'Beliebtes Gemüse für Balkon und Garten',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 3, 5, '#8B4513', 'Aussäen'),
          act('plant', 9, 9, '#228B22', 'Pflanzen'),
          act('fertilize', 11, 17, '#FFD700', 'Düngen'),
          act('harvest', 13, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Basilikum',
        isDefault: false,
        userId: null,
        notes: 'Küchenkraut, liebt Wärme',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 5, 9, '#8B4513', 'Aussäen'),
          act('harvest', 9, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Paprika',
        isDefault: false,
        userId: null,
        notes: 'Wärmeliebendes Gemüse',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 3, 5, '#8B4513', 'Aussäen'),
          act('plant', 9, 11, '#228B22', 'Pflanzen'),
          act('harvest', 15, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Erdbeeren',
        isDefault: false,
        userId: null,
        notes: 'Mehrjährige Pflanze, gut für Töpfe',
        location: 'partial-shade',
        category: 'vegetable',
        activities: [
          act('plant', 15, 17, '#228B22', 'Pflanzen'),
          act('harvest', 9, 13, '#DC143C', 'Ernten'),
          act('fertilize', 5, 7, '#FFD700', 'Düngen'),
        ],
      },
      {
        name: 'Schnittlauch',
        isDefault: false,
        userId: null,
        notes: 'Mehrjähriges Küchenkraut',
        location: 'partial-shade',
        category: 'vegetable',
        activities: [
          act('sow', 5, 9, '#8B4513', 'Aussäen'),
          act('harvest', 7, 19, '#DC143C', 'Ernten'),
        ],
      },
    ],
  },
  {
    id: 'gemuesegarten-anfaenger',
    name: { de: 'Gemüsegarten Anfänger', en: 'Vegetable Garden Beginner' },
    description: {
      de: '6 einfache Gemüsepflanzen für Einsteiger',
      en: '6 easy vegetables for beginners',
    },
    icon: '🥕',
    plants: [
      {
        name: 'Salat',
        isDefault: false,
        userId: null,
        notes: 'Schnell wachsend, wenig Pflege',
        location: 'partial-shade',
        category: 'vegetable',
        activities: [
          act('sow', 5, 15, '#8B4513', 'Aussäen'),
          act('harvest', 9, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Karotten',
        isDefault: false,
        userId: null,
        notes: 'Wurzelgemüse, im Topf oder Beet',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 5, 13, '#8B4513', 'Aussäen'),
          act('harvest', 13, 21, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Radieschen',
        isDefault: false,
        userId: null,
        notes: 'Sehr schnell, ideal für Einsteiger',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 5, 17, '#8B4513', 'Aussäen'),
          act('harvest', 7, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Zucchini',
        isDefault: false,
        userId: null,
        notes: 'Ertragreiche Pflanze',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 7, 9, '#8B4513', 'Aussäen'),
          act('plant', 9, 11, '#228B22', 'Pflanzen'),
          act('harvest', 11, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Bohnen',
        isDefault: false,
        userId: null,
        notes: 'Buschbohnen oder Stangenbohnen',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 9, 13, '#8B4513', 'Aussäen'),
          act('harvest', 13, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Gurken',
        isDefault: false,
        userId: null,
        notes: 'Erfrischend, viel Ertrag',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 7, 9, '#8B4513', 'Aussäen'),
          act('plant', 9, 11, '#228B22', 'Pflanzen'),
          act('harvest', 11, 19, '#DC143C', 'Ernten'),
        ],
      },
    ],
  },
  {
    id: 'kraeutergarten',
    name: { de: 'Kräutergarten', en: 'Herb Garden' },
    description: {
      de: '5 beliebte Küchenkräuter',
      en: '5 popular kitchen herbs',
    },
    icon: '🌱',
    plants: [
      {
        name: 'Petersilie',
        isDefault: false,
        userId: null,
        notes: 'Zweijähriges Küchenkraut',
        location: 'partial-shade',
        category: 'vegetable',
        activities: [
          act('sow', 3, 9, '#8B4513', 'Aussäen'),
          act('harvest', 7, 23, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Schnittlauch',
        isDefault: false,
        userId: null,
        notes: 'Mehrjährig, sehr robust',
        location: 'partial-shade',
        category: 'vegetable',
        activities: [
          act('sow', 5, 9, '#8B4513', 'Aussäen'),
          act('harvest', 7, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Thymian',
        isDefault: false,
        userId: null,
        notes: 'Mediterrane Staude, sehr robust',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('sow', 5, 7, '#8B4513', 'Aussäen'),
          act('harvest', 9, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Minze',
        isDefault: false,
        userId: null,
        notes: 'Sehr ausdauernd, besser im Topf halten',
        location: 'partial-shade',
        category: 'vegetable',
        activities: [
          act('plant', 7, 11, '#228B22', 'Pflanzen'),
          act('harvest', 9, 19, '#DC143C', 'Ernten'),
        ],
      },
      {
        name: 'Rosmarin',
        isDefault: false,
        userId: null,
        notes: 'Immergrüne mediterrane Pflanze',
        location: 'sun',
        category: 'vegetable',
        activities: [
          act('plant', 7, 9, '#228B22', 'Pflanzen'),
          act('harvest', 3, 23, '#DC143C', 'Ernten'),
          act('protect', 21, 23, '#9370DB', 'Winterschutz'),
        ],
      },
    ],
  },
];
