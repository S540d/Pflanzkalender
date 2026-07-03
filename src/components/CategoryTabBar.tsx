import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORY_TABS, CategoryFilter } from '../constants/categoryTabs';
import { AppText, Icon } from './ui';
import { radius, spacing, duration } from '../constants/designTokens';
import { shadeColor } from '../utils/colorUtils';

interface CategoryTabBarProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

interface CategoryChipProps {
  isActive: boolean;
  color: string;
  label: string;
  iconName: (typeof CATEGORY_TABS)[number]['iconName'];
  textSecondary: string;
  onPress: () => void;
}

/**
 * Einzelner Chip mit sanft cross-fadendem Hintergrund (Tint → Gradient).
 * Icon/Label existieren bewusst nur einmal (nicht pro Hintergrund-Layer),
 * sonst würden a11y-Queries (und Screenreader) den Text doppelt sehen.
 */
const CategoryChip: React.FC<CategoryChipProps> = ({
  isActive,
  color,
  label,
  iconName,
  textSecondary,
  onPress,
}) => {
  const activeOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(activeOpacity, {
      toValue: isActive ? 1 : 0,
      duration: duration.base,
      useNativeDriver: true,
    }).start();
  }, [isActive, activeOpacity]);

  return (
    <TouchableOpacity
      style={[styles.chipTouchable, { borderColor: isActive ? color : 'transparent' }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
    >
      <View
        style={[StyleSheet.absoluteFill, styles.chipBackground, { backgroundColor: color + '1A' }]}
      />
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.chipBackground, { opacity: activeOpacity }]}
      >
        <LinearGradient
          colors={[color, shadeColor(color, -15)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.chipContent}>
        <Icon name={iconName} size={16} color={isActive ? '#FFFFFF' : color} />
        <AppText
          variant="caption"
          numberOfLines={1}
          style={{
            color: isActive ? '#FFFFFF' : textSecondary,
            fontWeight: isActive ? '700' : '500',
          }}
        >
          {label}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export const CategoryTabBar: React.FC<CategoryTabBarProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <View
      style={[
        styles.tabBar,
        { borderBottomColor: theme.border, backgroundColor: theme.surfaceElevated },
      ]}
    >
      {CATEGORY_TABS.map((tab) => {
        const isActive = activeCategory === tab.value;
        const label = language === 'de' ? tab.labelDe : tab.labelEn;
        return (
          <CategoryChip
            key={tab.value}
            isActive={isActive}
            color={tab.color}
            label={label}
            iconName={tab.iconName}
            textSecondary={theme.textSecondary}
            onPress={() => onCategoryChange(tab.value)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  chipTouchable: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chipBackground: {
    borderRadius: radius.pill,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm - 1,
    paddingHorizontal: spacing.xs,
  },
});
