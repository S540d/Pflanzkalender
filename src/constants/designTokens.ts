/**
 * Design Tokens – Single Source of Truth für alle nicht-farblichen Design-Werte.
 *
 * Farben bleiben in `theme.ts` (light/dark-abhängig). Diese Datei deckt Spacing,
 * Radius, Typografie und Schatten ab – Werte, die unabhängig vom Theme gelten.
 *
 * Verwendung statt verstreuter Magic Numbers in StyleSheet.create():
 *   import { spacing, radius, typography, shadow } from '@/constants/designTokens';
 */
import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/** 4px-Basis-Raster. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Eckenradien – von dezent (Inputs) bis Pille (Chips). */
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/**
 * Typografie-Skala. Größere Haupttexte (15–17px) als bisher (11–13px) für
 * bessere Lesbarkeit. `fontWeight` als string-Literal für RN-Typkompatibilität.
 */
export const typography = {
  h1: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  h2: { fontSize: 21, fontWeight: '700', lineHeight: 28 },
  h3: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 23 },
  bodyStrong: { fontSize: 16, fontWeight: '600', lineHeight: 23 },
  bodySm: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

/**
 * Cross-platform Schatten in 3 Elevation-Stufen.
 * iOS/Web nutzen shadow*, Android `elevation`. Stufe 0 = flach.
 */
export type ShadowLevel = 0 | 1 | 2 | 3;

export function shadow(level: ShadowLevel, color = '#000000'): ViewStyle {
  if (level === 0) {
    return Platform.OS === 'android' ? { elevation: 0 } : {};
  }

  const config = {
    1: { offsetY: 1, radius: 3, opacity: 0.1, elevation: 2 },
    2: { offsetY: 3, radius: 8, opacity: 0.12, elevation: 4 },
    3: { offsetY: 8, radius: 18, opacity: 0.18, elevation: 8 },
  }[level];

  if (Platform.OS === 'android') {
    return { elevation: config.elevation };
  }

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: config.offsetY },
    shadowOpacity: config.opacity,
    shadowRadius: config.radius,
  };
}

/** Standard-Dauer für Micro-Interactions (ms). */
export const duration = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;
