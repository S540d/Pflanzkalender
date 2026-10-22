import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';

/**
 * Zentrales Icon-Mapping. Alle Icons der App laufen über semantische Namen,
 * damit das Set projektweit an einer Stelle getauscht werden kann (statt
 * Ionicons-Glyphnamen quer durch die Codebase zu streuen).
 */
const ICONS = {
  // Navigation / Tabs
  calendar: 'calendar-outline',
  agenda: 'list-outline',
  plant: 'leaf-outline',
  climate: 'partly-sunny-outline',
  templates: 'document-text-outline',
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

  // Klima / Resistenz
  heat: 'thermometer-outline',
  drought: 'water-outline',
  globe: 'earth-outline',

  // Meta / Standort
  sun: 'sunny-outline',
  partialShade: 'partly-sunny-outline',
  shade: 'cloudy-outline',
  vegetable: 'nutrition-outline',
  flower: 'flower-outline',
  tree: 'leaf-outline',
  location: 'location-outline',
  note: 'document-text-outline',
  info: 'information-circle-outline',
  language: 'language-outline',
  theme: 'color-palette-outline',
  link: 'open-outline',
  github: 'logo-github',
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorValue;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#1E2420' }) => {
  return <Ionicons name={ICONS[name]} size={size} color={color} />;
};
