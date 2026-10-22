import { brandHeader, brandPalette } from './brandPalette';

const L = brandPalette.light;
const D = brandPalette.dark;

/**
 * App-Theme. Werte kommen aus der gemeinsamen Markenpalette (`brandPalette.ts`,
 * wertgleich mit Safe my plants); Akzent des Pflanzkalenders ist Ocker.
 */
export const lightTheme = {
  background: L.paper,
  surface: L.surfaceAlt,
  surfaceElevated: L.surface,
  primary: L.forest,
  primaryDark: L.forest,
  primaryLight: L.sageSurface,
  /** Textfarbe auf `primary`-Flächen (Buttons, aktive Chips). */
  onPrimary: L.onForest,
  secondary: L.leaf,
  accent: L.ochre,
  accentLight: L.ochreSurface,
  text: L.text,
  textSecondary: L.textMuted,
  border: L.border,
  /** Sehr subtile Trennlinien innerhalb dichter Raster (Kalender-Grid) – heller als `border`. */
  gridLine: '#ECE8DC',
  error: L.statusOverdue,
  success: L.statusOk,
  warning: L.statusSoon,
  overlay: 'rgba(20, 30, 24, 0.45)',
  gradientStart: brandHeader.light.background,
  gradientEnd: brandHeader.light.background,
  headerTitle: brandHeader.light.title,
  headerSubtitle: brandHeader.light.subtitle,
};

export const darkTheme: Theme = {
  background: D.paper,
  surface: D.surfaceAlt,
  surfaceElevated: D.surface,
  primary: D.forest,
  primaryDark: D.forestMid,
  primaryLight: D.sageSurface,
  onPrimary: D.onForest,
  secondary: D.leaf,
  accent: D.ochre,
  accentLight: D.ochreSurface,
  text: D.text,
  textSecondary: D.textMuted,
  border: D.border,
  /** Sehr subtile Trennlinien innerhalb dichter Raster (Kalender-Grid) – dunkler als `border`. */
  gridLine: '#1E241F',
  error: D.statusOverdue,
  success: D.statusOk,
  warning: D.statusSoon,
  overlay: 'rgba(0, 0, 0, 0.7)',
  gradientStart: brandHeader.dark.background,
  gradientEnd: brandHeader.dark.background,
  headerTitle: brandHeader.dark.title,
  headerSubtitle: brandHeader.dark.subtitle,
};

export type Theme = typeof lightTheme;
