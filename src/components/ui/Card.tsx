import React from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, shadow, type ShadowLevel } from '../../constants/designTokens';

interface CardProps extends ViewProps {
  /** Schatten-Elevation (0–3, default 1). */
  elevation?: ShadowLevel;
  /** Innenabstand (default spacing.lg). `0` für randlose Karten. */
  padding?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Erhöhte Fläche mit Token-Schatten, Radius und `surfaceElevated`-Hintergrund.
 * Ersetzt flache <View>-Listen für mehr visuelle Tiefe.
 */
export const Card: React.FC<CardProps> = ({
  elevation = 1,
  padding = spacing.lg,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.surfaceElevated,
          borderRadius: radius.lg,
          padding,
          borderWidth: 1,
          borderColor: theme.border,
        },
        shadow(elevation),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
