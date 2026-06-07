import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORY_TABS, CategoryFilter } from '../constants/categoryTabs';
import { getPlantDisplayName } from '../constants/plantNames';
import { getPlantEmoji } from '../constants/plantEmojis';

interface ActivityInfo {
  plantName: string;
  plantEmoji: string;
  activityLabel: string;
  activityColor: string;
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
            <View
              key={index}
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.colorDot, { backgroundColor: activity.activityColor }]} />
                <Text style={[styles.activityLabel, { color: theme.text }]}>
                  {activity.activityLabel}
                </Text>
              </View>
              <Text style={[styles.plantName, { color: theme.text }]}>
                {activity.plantEmoji} {activity.plantName}
              </Text>
              {activity.notes && (
                <Text style={[styles.notes, { color: theme.textSecondary }]}>{activity.notes}</Text>
              )}
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Kategorie-Tabs */}
      <View
        style={[
          styles.tabBar,
          { borderBottomColor: theme.border, backgroundColor: theme.background },
        ]}
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.value;
          const label = language === 'de' ? tab.labelDe : tab.labelEn;
          return (
            <TouchableOpacity
              key={tab.value}
              style={styles.tab}
              onPress={() => setActiveCategory(tab.value)}
            >
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: isActive ? tab.color : tab.color + '30' },
                ]}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? tab.color : theme.textSecondary,
                    fontWeight: isActive ? '700' : '400',
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
  },
  scrollView: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  column: {
    width: 160,
    paddingTop: 4,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  columnSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
  },
});
