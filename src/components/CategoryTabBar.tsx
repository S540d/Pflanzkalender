import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORY_TABS, CategoryFilter } from '../constants/categoryTabs';
import { AppText, Icon } from './ui';
import { radius, spacing } from '../constants/designTokens';

interface CategoryTabBarProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

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
          <TouchableOpacity
            key={tab.value}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? tab.color : tab.color + '1A',
                borderColor: isActive ? tab.color : 'transparent',
              },
            ]}
            onPress={() => onCategoryChange(tab.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
          >
            <Icon name={tab.iconName} size={16} color={isActive ? '#FFFFFF' : tab.color} />
            <AppText
              variant="caption"
              numberOfLines={1}
              style={{
                color: isActive ? '#FFFFFF' : theme.textSecondary,
                fontWeight: isActive ? '700' : '500',
              }}
            >
              {label}
            </AppText>
          </TouchableOpacity>
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
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm - 1,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
