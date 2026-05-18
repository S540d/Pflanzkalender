import { PlantCategory } from '../types';

export type CategoryFilter = PlantCategory | 'all';

export interface CategoryTab {
  value: CategoryFilter;
  labelDe: string;
  labelEn: string;
  icon: string;
  color: string;
}

export const CATEGORY_TABS: CategoryTab[] = [
  { value: 'all', labelDe: 'Alle', labelEn: 'All', icon: '🌿', color: '#4CAF50' },
  {
    value: 'vegetable',
    labelDe: 'Nutzpflanzen',
    labelEn: 'Vegetables',
    icon: '🥦',
    color: '#F57C00',
  },
  { value: 'flower', labelDe: 'Blumen', labelEn: 'Flowers', icon: '🌸', color: '#E91E63' },
  { value: 'tree', labelDe: 'Bäume', labelEn: 'Trees', icon: '🌳', color: '#2E7D32' },
];
