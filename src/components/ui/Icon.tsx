import React from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * Zentrales Icon-Mapping. Alle Icons der App laufen über semantische Namen,
 * damit das Set projektweit an einer Stelle getauscht werden kann (statt
 * Ionicons-Glyphnamen quer durch die Codebase zu streuen).
 */
const ICONS = {
  // Navigation / Tabs
  calendar: 'calendar',
  agenda: 'list',
  plant: 'leaf',
  climate: 'partly-sunny',
  templates: 'document-text',
  settings: 'ellipsis-vertical',

  // Aktionen
  add: 'add',
  edit: 'create-outline',
  delete: 'trash-outline',
  close: 'close',
  check: 'checkmark',
  search: 'search',
  share: 'share-social-outline',
  download: 'download-outline',
  upload: 'cloud-upload-outline',
  qr: 'qr-code-outline',
  chevronLeft: 'chevron-back',
  chevronRight: 'chevron-forward',
  chevronDown: 'chevron-down',

  // Aktivitätstypen (Garten)
  sow: 'nutrition-outline',
  plantAction: 'leaf-outline',
  fertilize: 'flask-outline',
  water: 'water-outline',
  prune: 'cut-outline',
  harvest: 'basket-outline',
  protect: 'snow-outline',
  mulch: 'layers-outline',

  // Meta / Standort
  sun: 'sunny',
  partialShade: 'partly-sunny',
  shade: 'cloud',
  vegetable: 'nutrition',
  flower: 'flower',
  tree: 'leaf',
  location: 'location-outline',
  note: 'document-text-outline',
  info: 'information-circle-outline',
  language: 'language',
  theme: 'color-palette-outline',
  link: 'open-outline',
  github: 'logo-github',
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#000000' }) => {
  return <Ionicons name={ICONS[name]} size={size} color={color} />;
};
