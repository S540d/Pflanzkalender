import { PlantCategory } from '../types';
import type { IconName } from '../components/ui/Icon';

export type CategoryFilter = PlantCategory | 'all';

export interface CategoryTab {
  value: CategoryFilter;
  labelDe: string;
  labelEn: string;
  /** Emoji-Fallback (Legacy, weiterhin in Daten/Tests genutzt). */
  icon: string;
  /** Semantisches Vektor-Icon für die Tab-Chips. */
  iconName: IconName;
  color: string;
}

export const CATEGORY_TABS: CategoryTab[] = [
  {
    value: 'all',
    labelDe: 'Alle',
    labelEn: 'All',
    icon: '🌿',
    iconName: 'plant',
    color: '#2F5D43', // Waldgrün
  },
  {
    value: 'vegetable',
    labelDe: 'Nutzpflanzen',
    labelEn: 'Vegetables',
    icon: '🥦',
    iconName: 'vegetable',
    color: '#B5703F', // Kürbis gedämpft
  },
  {
    value: 'flower',
    labelDe: 'Blumen',
    labelEn: 'Flowers',
    icon: '🌸',
    iconName: 'flower',
    color: '#B4566E', // Altrosa
  },
  {
    value: 'tree',
    labelDe: 'Bäume',
    labelEn: 'Trees',
    icon: '🌳',
    iconName: 'tree',
    color: '#4E7A4A', // Moosgrün
  },
];
