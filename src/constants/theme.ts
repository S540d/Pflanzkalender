export const lightTheme = {
  background: '#FAFAF7',
  surface: '#F5F5F5',
  surfaceElevated: '#FFFFFF',
  primary: '#2E8F52',
  primaryDark: '#206B3C',
  primaryLight: '#E4F3E8',
  secondary: '#8BC34A',
  accent: '#E0672A',
  accentLight: '#FBEADF',
  text: '#16211A',
  textSecondary: '#5E6B63',
  border: '#E2E5E0',
  /** Sehr subtile Trennlinien innerhalb dichter Raster (Kalender-Grid) – heller als `border`. */
  gridLine: '#EEF1EC',
  error: '#F44336',
  success: '#2E8F52',
  warning: '#FF9800',
  overlay: 'rgba(20, 30, 24, 0.45)',
  gradientStart: '#2E8F52',
  gradientEnd: '#1D6136',
};

export const darkTheme = {
  background: '#0A0C09',
  surface: '#14170F',
  surfaceElevated: '#1B1F19',
  primary: '#5FCB7A',
  primaryDark: '#3F9E58',
  primaryLight: '#1C2E1F',
  secondary: '#9CCC65',
  accent: '#F0915A',
  accentLight: '#2E2013',
  text: '#F5F7F4',
  textSecondary: '#9BA69E',
  border: '#262B23',
  /** Sehr subtile Trennlinien innerhalb dichter Raster (Kalender-Grid) – dunkler als `border`. */
  gridLine: '#1C201A',
  error: '#EF5350',
  success: '#5FCB7A',
  warning: '#FFA726',
  overlay: 'rgba(0, 0, 0, 0.7)',
  gradientStart: '#3AA35A',
  gradientEnd: '#1F6E38',
};

export type Theme = typeof lightTheme;
