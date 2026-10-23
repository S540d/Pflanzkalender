import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ACTIVITY_TYPES } from '../constants/activityTypes';
import { spacing } from '../constants/designTokens';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme';
import { getContrastTextColor } from '../utils/colorUtils';
import { Icon } from './ui';

/** Legende der Aktivitätstypen (Farbe + Icon + Name) – schmale Kalenderbalken zeigen nur das Icon. */
export const ActivityLegend: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="activity-legend"
      style={[
        styles.scroll,
        { backgroundColor: theme.surfaceElevated, borderBottomColor: theme.border },
      ]}
      contentContainerStyle={styles.row}
    >
      {ACTIVITY_TYPES.map((type) => {
        const translated = t(`activity.type.${type.type}`);
        const label =
          typeof translated === 'string' && translated !== `activity.type.${type.type}`
            ? translated
            : type.label;
        return (
          <View key={type.type} style={styles.item}>
            <View style={[styles.chip, { backgroundColor: type.color }]}>
              <Icon name={type.icon} size={11} color={getContrastTextColor(type.color)} />
            </View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  row: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    gap: spacing.md,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  chip: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
