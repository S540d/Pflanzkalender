import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { CATEGORY_TABS, CategoryFilter } from '../constants/categoryTabs';

interface CategoryTabBarProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export const CategoryTabBar: React.FC<CategoryTabBarProps> = ({ activeCategory, onCategoryChange }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.tabBar, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
      {CATEGORY_TABS.map((tab) => {
        const isActive = activeCategory === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            style={styles.tab}
            onPress={() => onCategoryChange(tab.value)}
          >
            <View style={[
              styles.iconBadge,
              { backgroundColor: isActive ? tab.color : tab.color + '30' },
            ]}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
            </View>
            <Text style={[styles.tabLabel, { color: isActive ? tab.color : theme.textSecondary, fontWeight: isActive ? '700' : '400' }]}>
              {tab.label}
            </Text>
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
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 9,
  },
});
