import React from 'react';
import { Text, type TextProps, type TextStyle, type StyleProp } from 'react-native';
import { typography, type TypographyVariant } from '../../constants/designTokens';

interface AppTextProps extends TextProps {
  /** Typografie-Variante aus der Skala (default: 'body'). */
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Text mit zentraler Typografie-Skala. Ersetzt verstreute fontSize/fontWeight.
 *   <AppText variant="h2">Titel</AppText>
 */
export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}) => {
  return (
    <Text style={[typography[variant] as TextStyle, color ? { color } : null, style]} {...rest}>
      {children}
    </Text>
  );
};
