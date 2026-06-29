import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { radius, spacing, typography } from '../../constants/designTokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

interface BadgeProps {
  label: string;
  /** Akzentfarbe; Hintergrund wird als helle Tönung daraus abgeleitet. */
  color: string;
  icon?: IconName;
  /** Optionaler heller Hintergrund (sonst aus `color` mit Alpha). */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Kompaktes Label mit Icon + Farbe für Kategorien, Standort, Aktivitätstypen.
 * Hintergrund ist eine helle Tönung der Akzentfarbe (gut lesbarer Kontrast).
 */
export const Badge: React.FC<BadgeProps> = ({ label, color, icon, backgroundColor, style }) => {
  return (
    <View
      style={[styles.badge, { backgroundColor: backgroundColor ?? withAlpha(color, 0.14) }, style]}
    >
      {icon ? <Icon name={icon} size={13} color={color} /> : null}
      <AppText style={[typography.caption, { color }]}>{label}</AppText>
    </View>
  );
};

/** Hängt einen Alpha-Wert an eine #RRGGBB-Farbe (Web/RN-kompatibel). */
function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${normalized}${a}`;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs - 1,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
