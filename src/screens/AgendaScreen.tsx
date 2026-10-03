import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CategoryFilter } from '../constants/categoryTabs';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { getPlantDisplayName } from '../constants/plantNames';
import { getPlantEmoji } from '../constants/plantEmojis';
import { getActivityTypeByType } from '../constants/activityTypes';
import { getActivityDisplayLabel } from '../utils/activityLabel';
import { getPlantDisplayNotes } from '../constants/plantNames';
import { Card, Icon, type IconName } from '../components/ui';
import { ActivityCompletionModal } from '../components/ActivityCompletionModal';
import { ActivityJournal, type JournalEntry } from '../components/ActivityJournal';
import { getCompletion, toIsoDate, yearForHalfMonthOffset } from '../utils/completions';
import type { ActivityCompletion } from '../types';
import { radius, spacing } from '../constants/designTokens';

interface ActivityInfo {
  plantId: string;
  activityId: string;
  year: number;
  completion?: ActivityCompletion;
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
  const { plants, setActivityCompletion } = usePlants();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [view, setView] = useState<'upcoming' | 'journal'>('upcoming');
  const [editing, setEditing] = useState<{
    plantId: string;
    activityId: string;
    year: number;
    plantName: string;
    activityLabel: string;
  } | null>(null);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

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
    (monthIndex: number, year: number): ActivityInfo[] => {
      const activities: ActivityInfo[] = [];
      filteredPlants.forEach((plant) => {
        plant.activities.forEach((activity) => {
          if (activity.startMonth <= monthIndex && activity.endMonth >= monthIndex) {
            activities.push({
              plantId: plant.id,
              activityId: activity.id,
              year,
              completion: getCompletion(activity, year),
              plantName: getPlantDisplayName(plant.name, language),
              plantEmoji: getPlantEmoji(plant.name, plant.category),
              activityLabel: getActivityDisplayLabel(activity, t),
              activityColor: activity.color,
              activityIcon: getActivityTypeByType(activity.type)?.icon,
              notes: getPlantDisplayNotes(plant.name, plant.notes, language),
            });
          }
        });
      });
      return activities.sort((a, b) => a.plantName.localeCompare(b.plantName, language));
    },
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
          activityColor: activity.color,
          activityIcon: getActivityTypeByType(activity.type)?.icon,
          date: completion.date,
          note: completion.note,
        });
      });
    });
    return entries;
  }, [filteredPlants, currentYear, language, t]);

  const toggleDone = (info: ActivityInfo) => {
    setActivityCompletion(
      info.plantId,
      info.activityId,
      info.year,
      info.completion ? null : { date: toIsoDate(new Date()) }
    );
  };

  const openEditor = (info: ActivityInfo) => {
    setEditing({
      plantId: info.plantId,
      activityId: info.activityId,
      year: info.year,
      plantName: info.plantName,
      activityLabel: info.activityLabel,
    });
  };

  const editingCompletion = editing
    ? getCompletion(
        plants
          .find((p) => p.id === editing.plantId)
          ?.activities.find((a) => a.id === editing.activityId) ?? {},
        editing.year
      )
    : undefined;

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
          activities.map((activity, index) => {
            const done = !!activity.completion;
            return (
              <Card
                key={index}
                elevation={1}
                padding={spacing.md}
                style={[
                  styles.card,
                  { borderLeftWidth: 4, borderLeftColor: activity.activityColor },
                  done && styles.cardDone,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconChip, { backgroundColor: activity.activityColor }]}>
                    {activity.activityIcon ? (
                      <Icon name={activity.activityIcon} size={13} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.activityLabel,
                      { color: theme.text },
                      done && styles.activityLabelDone,
                    ]}
                  >
                    {activity.activityLabel}
                  </Text>
                  <TouchableOpacity
                    testID={`agenda-check-${activity.plantId}-${activity.activityId}-${activity.year}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: done }}
                    accessibilityLabel={String(
                      t(done ? 'completion.markOpen' : 'completion.markDone')
                    )}
                    onPress={() => toggleDone(activity)}
                    onLongPress={() => openEditor(activity)}
                    hitSlop={8}
                    style={[
                      styles.checkbox,
                      { borderColor: done ? theme.primary : theme.border },
                      done && { backgroundColor: theme.primary },
                    ]}
                  >
                    {done ? <Icon name="check" size={14} color="#FFFFFF" /> : null}
                  </TouchableOpacity>
                </View>
                <View style={styles.plantNameRow}>
                  <Text style={styles.plantEmoji}>{activity.plantEmoji}</Text>
                  <Text style={[styles.plantName, { color: theme.text }]}>
                    {activity.plantName}
                  </Text>
                </View>
                {activity.completion ? (
                  <TouchableOpacity
                    testID={`agenda-done-${activity.plantId}-${activity.activityId}-${activity.year}`}
                    onPress={() => openEditor(activity)}
                  >
                    <Text style={[styles.doneInfo, { color: theme.primary }]}>
                      ✓ {activity.completion.date}
                      {activity.completion.note ? ` – ${activity.completion.note}` : ''}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {activity.notes && (
                  <Text style={[styles.notes, { color: theme.textSecondary }]}>
                    {activity.notes}
                  </Text>
                )}
              </Card>
            );
          })
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
              <Text style={[styles.viewToggleText, { color: active ? '#FFFFFF' : theme.text }]}>
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
          onEntryPress={(entry) =>
            setEditing({
              plantId: entry.plantId,
              activityId: entry.activityId,
              year: currentYear,
              plantName: entry.plantName,
              activityLabel: entry.activityLabel,
            })
          }
        />
      )}

      <ActivityCompletionModal
        visible={editing !== null}
        plantName={editing?.plantName ?? ''}
        activityLabel={editing?.activityLabel ?? ''}
        year={editing?.year ?? currentYear}
        completion={editingCompletion}
        onSave={(completion) => {
          if (editing) {
            setActivityCompletion(editing.plantId, editing.activityId, editing.year, completion);
          }
          setEditing(null);
        }}
        onRemove={() => {
          if (editing) {
            setActivityCompletion(editing.plantId, editing.activityId, editing.year, null);
          }
          setEditing(null);
        }}
        onClose={() => setEditing(null)}
      />
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
  cardDone: {
    opacity: 0.7,
  },
  activityLabelDone: {
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  doneInfo: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
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
