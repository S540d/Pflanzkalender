export interface Activity {
  id: string;
  type: string;
  startMonth: number; // 0-23 (0 = Jan erste Hälfte, 1 = Jan zweite Hälfte)
  endMonth: number;
  color: string;
  label: string;
}

export interface Plant {
  id: string;
  name: string;
  isDefault: boolean;
  userId: string | null;
  activities: Activity[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
