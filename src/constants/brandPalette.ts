/**
 * Gemeinsame Markenpalette für Safe my plants und Pflanzkalender.
 *
 * Die Werte dieser Datei sind in beiden Repos IDENTISCH zu halten (nur die
 * Formatierung folgt der jeweiligen Prettier-Konfiguration) – Änderungen immer
 * in beiden Projekten gleichzeitig vornehmen. Die app-spezifischen Theme-Dateien
 * (`theme.ts`) mappen ihre Schlüssel auf diese Werte; nur `accent` unterscheidet
 * sich pro App (Safe my plants: Terrakotta, Pflanzkalender: Ocker).
 */
export const brandPalette = {
  light: {
    paper: '#F7F4EC',
    surface: '#FFFFFF',
    surfaceAlt: '#EFEBE0',
    forest: '#1F3D2B',
    forestMid: '#2F5D43',
    sage: '#8DAA91',
    sageSurface: '#E3EBE1',
    leaf: '#4E8F5E',
    text: '#1E2420',
    textMuted: '#5F6B63',
    textSubtle: '#8A938C',
    border: '#E2DDD0',
    onForest: '#FFFFFF',
    onForestMuted: '#C9D9CC',
    statusOk: '#4E8F5E',
    statusSoon: '#D9962B',
    statusSoonSurface: '#FBF1DF',
    statusOverdue: '#C4513D',
    statusOverdueSurface: '#F8E4DF',
    terracotta: '#C26A4A',
    terracottaSurface: '#F6E6DE',
    ochre: '#D4A237',
    ochreSurface: '#F8EDD2',
  },
  dark: {
    paper: '#121613',
    surface: '#1B211C',
    surfaceAlt: '#232A24',
    forest: '#8FC79E',
    forestMid: '#6FA97F',
    sage: '#5E7A64',
    sageSurface: '#22302A',
    leaf: '#7BBF8B',
    text: '#EEF1EA',
    textMuted: '#A3ADA5',
    textSubtle: '#76807A',
    border: '#2C352E',
    onForest: '#121613',
    onForestMuted: '#9DB5A3',
    statusOk: '#7BBF8B',
    statusSoon: '#E6B05A',
    statusSoonSurface: '#2E2717',
    statusOverdue: '#E07A66',
    statusOverdueSurface: '#36201B',
    terracotta: '#DE8C6D',
    terracottaSurface: '#33231C',
    ochre: '#E6BE5E',
    ochreSurface: '#302816',
  },
};

/** Header-Hintergrund ist in beiden Modi dunkles Waldgrün (Markenfläche). */
export const brandHeader = {
  light: { background: '#1F3D2B', title: '#FFFFFF', subtitle: '#C9D9CC' },
  dark: { background: '#16241B', title: '#EEF1EA', subtitle: '#9DB5A3' },
};

/** Display-Schrift für Überschriften (Fraunces), geladen in `app/_layout.tsx`. */
export const brandFonts = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
} as const;

/** Gemeinsame Formsprache. */
export const brandShape = {
  radiusCard: 16,
  radiusControl: 12,
  radiusPill: 999,
} as const;
