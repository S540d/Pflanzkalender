/**
 * Berechnet anhand der relativen Luminanz einer Hintergrundfarbe,
 * ob schwarzer oder weißer Text besser lesbar ist (WCAG 2.1).
 *
 * Der Schwellenwert 0.179 ist der Punkt gleichen Kontrasts zwischen Schwarz und Weiß:
 *   (L + 0.05) / 0.05 = 1.05 / (L + 0.05)  →  L = sqrt(1.05 * 0.05) - 0.05 ≈ 0.179
 * Oberhalb davon hat schwarzer Text, unterhalb weißer Text das höhere Kontrastverhältnis.
 * Dies entspricht dem WCAG AA-Standard von 4.5:1 für normalen Text.
 *
 * Unterstützt 3- und 6-stellige Hex-Farben (z. B. '#FFF', '#FFEB3B').
 *
 * @param hex - Hintergrundfarbe als Hex-String
 * @returns '#000000' für helle Hintergründe, '#FFFFFF' für dunkle
 */
export const getContrastTextColor = (hex: string): string => {
  let sanitized = hex.replace('#', '');

  // Kurzformat (#RGB) auf 6 Stellen expandieren
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map(c => c + c)
      .join('');
  }

  if (sanitized.length !== 6) {
    return '#000000';
  }

  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return '#000000';
  }

  // Relative Luminanz nach WCAG 2.1 (sRGB → linear)
  const toLinear = (c: number) => {
    const sRGB = c / 255;
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.179 ? '#000000' : '#FFFFFF';
};
