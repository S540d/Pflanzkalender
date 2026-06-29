import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getContrastTextColor } from '../../utils/colorUtils';
import { radius, spacing, typography, duration } from '../../constants/designTokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Überschreibt die Variantenfarbe (z. B. Aktivitätsfarbe). */
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

const SIZE_MAP: Record<Size, { padV: number; padH: number; font: number; icon: number }> = {
  sm: { padV: spacing.xs + 2, padH: spacing.md, font: 13, icon: 16 },
  md: { padV: spacing.md - 2, padH: spacing.lg, font: 15, icon: 18 },
  lg: { padV: spacing.md + 2, padH: spacing.xl, font: 17, icon: 20 },
};

/**
 * Einheitlicher Button mit Press-Feedback (Animated Scale) und Varianten.
 * Ersetzt die zahlreichen inline-gestylten TouchableOpacity-Buttons.
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  color,
  disabled = false,
  fullWidth = false,
  style,
  testID,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const dims = SIZE_MAP[size];

  const baseColor = color ?? (variant === 'danger' ? theme.error : theme.primary);

  let backgroundColor: string;
  let textColor: string;
  let borderColor: string | undefined;

  switch (variant) {
    case 'primary':
    case 'danger':
      backgroundColor = baseColor;
      textColor = getContrastTextColor(baseColor);
      break;
    case 'secondary':
      backgroundColor = theme.surface;
      textColor = baseColor;
      borderColor = theme.border;
      break;
    case 'ghost':
    default:
      backgroundColor = 'transparent';
      textColor = baseColor;
      break;
  }

  const animateTo = (to: number) =>
    Animated.timing(scale, {
      toValue: to,
      duration: duration.fast,
      useNativeDriver: true,
    }).start();

  return (
    <Animated.View
      style={[
        { transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
        fullWidth ? styles.fullWidth : null,
        style,
      ]}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        disabled={disabled}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        style={[
          styles.base,
          {
            backgroundColor,
            borderRadius: radius.md,
            paddingVertical: dims.padV,
            paddingHorizontal: dims.padH,
            borderWidth: borderColor ? 1 : 0,
            borderColor,
          },
        ]}
      >
        {icon ? <Icon name={icon} size={dims.icon} color={textColor} /> : null}
        {label ? (
          <AppText
            style={[typography.bodyStrong, { fontSize: dims.font, color: textColor }]}
            numberOfLines={1}
          >
            {label}
          </AppText>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
