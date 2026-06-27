import type { IconName } from '../components/ui/Icon';

export interface ActivityType {
  type: string;
  color: string;
  label: string;
  /** Semantisches Icon (siehe Icon-Mapping) – für Bars, Agenda, Picker. */
  icon: IconName;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { type: 'sow', color: '#4CAF50', label: 'Aussäen', icon: 'sow' }, // Grün
  { type: 'plant', color: '#66BB6A', label: 'Pflanzen', icon: 'plantAction' }, // Hellgrün
  { type: 'fertilize', color: '#FFA726', label: 'Düngen', icon: 'fertilize' }, // Orange
  { type: 'water', color: '#42A5F5', label: 'Gießen', icon: 'water' }, // Hellblau
  { type: 'prune', color: '#FFEB3B', label: 'Zurückschneiden', icon: 'prune' }, // Gelb
  { type: 'harvest', color: '#EF5350', label: 'Ernten', icon: 'harvest' }, // Rot
  { type: 'protect', color: '#7E57C2', label: 'Winterschutz', icon: 'protect' }, // Lila
  { type: 'mulch', color: '#FF9800', label: 'Mulchen', icon: 'mulch' }, // Orange
];

export const getActivityTypeByType = (type: string): ActivityType | undefined => {
  return ACTIVITY_TYPES.find((at) => at.type === type);
};
