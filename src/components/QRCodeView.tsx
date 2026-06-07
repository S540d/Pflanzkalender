import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { buildQrMatrix } from '../utils/qrcode';

interface QRCodeViewProps {
  /** Der zu kodierende Text. */
  value: string;
  /** Kantenlänge des QR-Codes in px (default 220). */
  size?: number;
  /** Ruhezone in Modulen rund um den Code (QR-Standard: 4). */
  quietZone?: number;
  /** Text, der angezeigt wird, wenn der Wert zu groß für einen QR-Code ist. */
  tooLargeLabel?: string;
  /** Farbe der dunklen Module (default schwarz – für Scanbarkeit nicht ändern). */
  color?: string;
}

/**
 * Rendert einen QR-Code als SVG (plattformübergreifend via react-native-svg).
 * Keine native Abhängigkeit – funktioniert auf Web, iOS und Android.
 */
export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 220,
  quietZone = 4,
  tooLargeLabel,
  color = '#000000',
}) => {
  const matrix = useMemo(() => buildQrMatrix(value), [value]);

  if (!matrix) {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <Text style={styles.fallbackText}>{tooLargeLabel ?? '—'}</Text>
      </View>
    );
  }

  const count = matrix.length;
  const totalModules = count + quietZone * 2;
  // Build a single path of all dark modules – cheaper than thousands of <Rect>.
  let path = '';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (matrix[row][col]) {
        const x = col + quietZone;
        const y = row + quietZone;
        path += `M${x} ${y}h1v1h-1z`;
      }
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${totalModules} ${totalModules}`}>
      {/* White background incl. quiet zone for reliable scanning */}
      <Rect x={0} y={0} width={totalModules} height={totalModules} fill="#FFFFFF" />
      <Path d={path} fill={color} />
    </Svg>
  );
};

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  fallbackText: {
    color: '#666666',
    fontSize: 13,
    textAlign: 'center',
  },
});
