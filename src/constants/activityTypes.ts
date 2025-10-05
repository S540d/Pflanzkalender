export interface ActivityType {
  type: string;
  color: string;
  label: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { type: 'sow', color: '#8B4513', label: 'Aussäen' },
  { type: 'plant', color: '#228B22', label: 'Pflanzen' },
  { type: 'fertilize', color: '#FFD700', label: 'Düngen' },
  { type: 'water', color: '#4169E1', label: 'Gießen' },
  { type: 'prune', color: '#FF8C00', label: 'Zurückschneiden' },
  { type: 'harvest', color: '#DC143C', label: 'Ernten' },
  { type: 'protect', color: '#9370DB', label: 'Winterschutz' },
  { type: 'mulch', color: '#A0522D', label: 'Mulchen' },
];

export const getActivityTypeByType = (type: string): ActivityType | undefined => {
  return ACTIVITY_TYPES.find(at => at.type === type);
};
