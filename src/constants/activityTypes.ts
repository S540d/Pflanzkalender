export interface ActivityType {
  type: string;
  color: string;
  label: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { type: 'sow', color: '#4CAF50', label: 'Aussäen' },       // Grün
  { type: 'plant', color: '#66BB6A', label: 'Pflanzen' },    // Hellgrün
  { type: 'fertilize', color: '#FFA726', label: 'Düngen' },  // Orange
  { type: 'water', color: '#42A5F5', label: 'Gießen' },      // Hellblau
  { type: 'prune', color: '#FFEB3B', label: 'Zurückschneiden' }, // Gelb
  { type: 'harvest', color: '#EF5350', label: 'Ernten' },    // Rot
  { type: 'protect', color: '#7E57C2', label: 'Winterschutz' }, // Lila
  { type: 'mulch', color: '#FF9800', label: 'Mulchen' },     // Orange
];

export const getActivityTypeByType = (type: string): ActivityType | undefined => {
  return ACTIVITY_TYPES.find(at => at.type === type);
};
