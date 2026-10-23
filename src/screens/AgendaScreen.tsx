import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CategoryFilter } from '../constants/categoryTabs';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { getPlantDisplayName } from '../constants/plantNames';
import { getPlantEmoji } from '../constants/plantEmojis';
import { getActivityColor, getActivityTypeByType } from '../constants/activityTypes';
import { getActivityDisplayLabel } from '../utils/activityLabel';
import { ActivityCard } from '../components/ActivityCard';
import {
  currentHalfMonthIndex,
  getHalfMonthActivities,
  type ActivityInfo,
} from '../utils/agendaActivities';
import { ScreenHeader } from '../components/ScreenHeader';
import { ActivityJournal, type JournalEntry } from '../components/ActivityJournal';
import { useCompletionEditor } from '../hooks/useCompletionEditor';
import { getCompletion, yearForHalfMonthOffset } from '../utils/completions';
import { radius, spacing } from '../constants/designTokens';
import { useGardenOffset } from '../contexts/GardenOffsetContext';
import { applyGardenOffset } from '../utils/gardenOffset';

// Offsets relative to current half-month: 1 previous + current + 5 forward = 7 columns
const COLUMN_OFFSETS = [-1, 0, 1, 2, 3, 4, 5] as const;

export const AgendaScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants } = usePlants();
  const { t, language } = useLanguage();
  const { offset: gardenOffset } = useGardenOffset();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [view, setView] = useState<'upcoming' | 'journal'>('upcoming');
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { toggleDone, openEditor, editor } = useCompletionEditor(currentYear);

  // Current half-month index (0-23)
  const currentMonth = useMemo(() => currentHalfMonthIndex(), []);

  const filteredPlants = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? plants
        : plants.filter((p) => (p.category ?? 'vegetable') === activeCategory);
    // Darstellung mit Garten-Zeitversatz (gespeicherte Daten bleiben unverändert)
    return applyGardenOffset(filtered, gardenOffset);
  }, [plants, activeCategory, gardenOffset]);

  const getActivitiesForMonth = useCallback(
    (monthIndex: number, year: number): ActivityInfo[] =>
      getHalfMonthActivities(filteredPlants, monthIndex, year, language, t),
    [filteredPlants, language, t]
  );

  const monthNames = t('agenda.months') as string[];

  // Pre-compute activities for all 7 columns
  const columnData = useMemo(
    () =>
      COLUMN_OFFSETS.map((offset) => {
        const monthIndex = (currentMonth + offset + 24) % 24;
        const year = yearForHalfMonthOffset(currentYear, currentMonth, offset);
        return { offset, monthIndex, activities: getActivitiesForMonth(monthIndex, year) };
      }),
    [currentYear, currentMonth, getActivitiesForMonth]
  );

  const journalEntries = useMemo<JournalEntry[]>(() => {
    const entries: JournalEntry[] = [];
    filteredPlants.forEach((plant) => {
      plant.activities.forEach((activity) => {
        const completion = getCompletion(activity, currentYear);
        if (!completion) return;
        entries.push({
          key: `${plant.id}-${activity.id}`,
          plantId: plant.id,
          activityId: activity.id,
          plantName: getPlantDisplayName(plant.name, language),
          plantEmoji: getPlantEmoji(plant.name, plant.category),
          activityLabel: getActivityDisplayLabel(activity, t),
          activityColor: getActivityColor(activity),
          activityIcon: getActivityTypeByType(activity.type)?.icon,
          date: completion.date,
          note: completion.note,
        });
      });
    });
    return entries;
  }, [filteredPlants, currentYear, language, t]);

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
        testID={`agenda-column-${offset}`}
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
          activities.map((activity) => (
            <ActivityCard
              key={`${activity.plantId}-${activity.activityId}`}
              activity={activity}
              onToggle={toggleDone}
              onEdit={openEditor}
            />
          ))
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Agenda" />
      <CategoryTabBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <View style={styles.viewToggle}>
        {(['upcoming', 'journal'] as const).map((mode) => {
          const active = view === mode;
          return (
            <TouchableOpacity
              key={mode}
              testID={`agenda-view-${mode}`}
              onPress={() => setView(mode)}
              style={[
                styles.viewToggleBtn,
                { borderColor: active ? theme.primary : theme.border },
                active && { backgroundColor: theme.primary },
              ]}
            >
              <Text
                style={[styles.viewToggleText, { color: active ? theme.onPrimary : theme.text }]}
              >
                {String(t(mode === 'upcoming' ? 'agenda.viewUpcoming' : 'agenda.viewJournal'))}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {view === 'upcoming' ? (
        <ScrollView horizontal style={styles.scrollView}>
          <View style={styles.columnsContainer}>
            {columnData.map(({ offset, monthIndex, activities }) =>
              renderColumn(monthIndex, offset, activities)
            )}
          </View>
        </ScrollView>
      ) : (
        <ActivityJournal
          year={currentYear}
          entries={journalEntries}
          onEntryPress={(entry) => openEditor({ ...entry, year: currentYear })}
        />
      )}

      {editor}
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
  viewToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  viewToggleBtn: {
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  viewToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
