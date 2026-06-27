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
    color: '#4CAF50',
  },
  {
    value: 'vegetable',
    labelDe: 'Nutzpflanzen',
    labelEn: 'Vegetables',
    icon: '🥦',
    iconName: 'vegetable',
    color: '#F57C00',
  },
  {
    value: 'flower',
    labelDe: 'Blumen',
    labelEn: 'Flowers',
    icon: '🌸',
    iconName: 'flower',
    color: '#E91E63',
  },
  {
    value: 'tree',
    labelDe: 'Bäume',
    labelEn: 'Trees',
    icon: '🌳',
    iconName: 'tree',
    color: '#2E7D32',
  },
];
