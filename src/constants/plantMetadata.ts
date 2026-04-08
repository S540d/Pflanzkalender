import { PlantLocation, PlantCategory } from '../types';

export const PLANT_LOCATION_METADATA: Record<
  PlantLocation,
  { de: string; en: string; icon: string }
> = {
  sun: { de: 'Sonne', en: 'Sun', icon: '☀️' },
  'partial-shade': { de: 'Halbschatten', en: 'Partial Shade', icon: '⛅' },
  shade: { de: 'Schatten', en: 'Shade', icon: '🌥️' },
};

export const PLANT_CATEGORY_METADATA: Record<
  PlantCategory,
  { de: string; en: string; icon: string }
> = {
  vegetable: { de: 'Nutzpflanze', en: 'Vegetable / Herb', icon: '🥦' },
  flower: { de: 'Blume', en: 'Flower', icon: '🌸' },
  tree: { de: 'Baum', en: 'Tree', icon: '🌳' },
};
