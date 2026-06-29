import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CategoryFilter } from '../constants/categoryTabs';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { getPlantDisplayName } from '../constants/plantNames';
import { getPlantEmoji } from '../constants/plantEmojis';
import { getActivityTypeByType } from '../constants/activityTypes';
import { Card, Icon, type IconName } from '../components/ui';
import { radius, spacing } from '../constants/designTokens';

interface ActivityInfo {
  plantName: string;
  plantEmoji: string;
  activityLabel: string;
  activityColor: string;
  activityIcon?: IconName;
  notes?: string;
}

// Offsets relative to current half-month: 1 previous + current + 5 forward = 7 columns
const COLUMN_OFFSETS = [-1, 0, 1, 2, 3, 4, 5] as const;

export const AgendaScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants } = usePlants();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  // Current half-month index (0-23)
  const currentMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const halfMonth = now.getDate() <= 15 ? 0 : 1;
    return month * 2 + halfMonth;
  }, []);

  const filteredPlants = useMemo(() => {
    if (activeCategory === 'all') return plants;
    return plants.filter((p) => (p.category ?? 'vegetable') === activeCategory);
  }, [plants, activeCategory]);

  const getActivitiesForMonth = useCallback(
    (monthIndex: number): ActivityInfo[] => {
      const activities: ActivityInfo[] = [];
      filteredPlants.forEach((plant) => {
        plant.activities.forEach((activity) => {
          if (activity.startMonth <= monthIndex && activity.endMonth >= monthIndex) {
            activities.push({
              plantName: getPlantDisplayName(plant.name, language),
              plantEmoji: getPlantEmoji(plant.name, plant.category),
              activityLabel: activity.label,
              activityColor: activity.color,
              activityIcon: getActivityTypeByType(activity.type)?.icon,
              notes: plant.notes,
            });
          }
        });
      });
      return activities.sort((a, b) => a.plantName.localeCompare(b.plantName, language));
    },
    [filteredPlants, language]
  );

  const monthNames = t('agenda.months') as string[];

  // Pre-compute activities for all 7 columns
  const columnData = useMemo(
    () =>
      COLUMN_OFFSETS.map((offset) => {
        const monthIndex = (currentMonth + offset + 24) % 24;
        return { offset, monthIndex, activities: getActivitiesForMonth(monthIndex) };
      }),
    [currentMonth, getActivitiesForMonth]
  );

  const getColumnTitle = (offset: number, monthIndex: number): string => {
    if (offset === -1) return String(t('agenda.previous'));
    if (offset === 0) return String(t('agenda.current'));
    if (offset === 1) return String(t('agenda.next'));
    return monthNames[monthIndex];
  };

  const renderColumn = (monthIndex: number, offset: number, activities: ActivityInfo[]) => {
    const isCurrent = offset === 0;
    const title = getColumnTitle(offset, monthIndex);
    // For offset -1/0/1 show the role label as title and date range as subtitle;
    // for offset 2-5 the month name IS the title, no subtitle needed
    const showSubtitle = offset >= -1 && offset <= 1;

    return (
      <View
        key={`col-${monthIndex}-${offset}`}
        style={[styles.column, isCurrent && { borderTopWidth: 3, borderTopColor: theme.primary }]}
      >
        <Text style={[styles.columnTitle, { color: isCurrent ? theme.primary : theme.text }]}>
          {title}
        </Text>
        {showSubtitle && (
          <Text style={[styles.columnSubtitle, { color: theme.textSecondary }]}>
            {monthNames[monthIndex]}
          </Text>
        )}

        {activities.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t('agenda.noActivities')}
          </Text>
        ) : (
          activities.map((activity, index) => (
            <Card
              key={index}
              elevation={1}
              padding={spacing.md}
              style={[styles.card, { borderLeftWidth: 4, borderLeftColor: activity.activityColor }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconChip, { backgroundColor: activity.activityColor }]}>
                  {activity.activityIcon ? (
                    <Icon name={activity.activityIcon} size={13} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text style={[styles.activityLabel, { color: theme.text }]}>
                  {activity.activityLabel}
                </Text>
              </View>
              <View style={styles.plantNameRow}>
                <Text style={styles.plantEmoji}>{activity.plantEmoji}</Text>
                <Text style={[styles.plantName, { color: theme.text }]}>{activity.plantName}</Text>
              </View>
              {activity.notes && (
                <Text style={[styles.notes, { color: theme.textSecondary }]}>{activity.notes}</Text>
              )}
            </Card>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CategoryTabBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.columnsContainer}>
          {columnData.map(({ offset, monthIndex, activities }) =>
            renderColumn(monthIndex, offset, activities)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  column: {
    width: 168,
    paddingTop: spacing.xs,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  columnSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  iconChip: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  plantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  plantEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  plantName: {
    fontSize: 15,
    fontWeight: '600',
  },
  notes: {
    fontSize: 12,
    lineHeight: 17,
  },
});
