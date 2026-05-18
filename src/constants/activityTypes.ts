export interface ActivityType {
  type: string;
  color: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { type: 'sow', color: '#4CAF50' },
  { type: 'plant', color: '#66BB6A' },
  { type: 'fertilize', color: '#FFA726' },
  { type: 'water', color: '#42A5F5' },
  { type: 'prune', color: '#FFEB3B' },
  { type: 'harvest', color: '#EF5350' },
  { type: 'protect', color: '#7E57C2' },
  { type: 'mulch', color: '#FF9800' },
];

export const getActivityTypeByType = (type: string): ActivityType | undefined => {
  return ACTIVITY_TYPES.find((at) => at.type === type);
};
