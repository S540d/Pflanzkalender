import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGardenOffset } from '../contexts/GardenOffsetContext';
import { useCompletionEditor } from '../hooks/useCompletionEditor';
import { CategoryFilter } from '../constants/categoryTabs';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { ActivityCard } from '../components/ActivityCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card, Icon } from '../components/ui';
import { radius, spacing, typography } from '../constants/designTokens';
import { applyGardenOffset } from '../utils/gardenOffset';
import { yearForHalfMonthOffset } from '../utils/completions';
import { currentHalfMonthIndex, getHalfMonthActivities } from '../utils/agendaActivities';

/** Wie viele Aufgaben des nächsten Halbmonats als Vorschau gezeigt werden. */
const NEXT_PREVIEW_LIMIT = 5;

/**
 * Startseite „Jetzt im Garten": die Aufgaben des laufenden Halbmonats zum Abhaken,
 * darunter eine kurze Vorschau auf den nächsten. Der Jahreskalender ist ein eigener Tab,
 * die Mehrspalten-Agenda und das Journal erreicht man über den Link am Ende.
 */
export const NowScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants } = usePlants();
  const { t, language } = useLanguage();
  const { offset: gardenOffset } = useGardenOffset();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentMonth = useMemo(() => currentHalfMonthIndex(), []);
  const { toggleDone, openEditor, editor } = useCompletionEditor(currentYear);

  const filteredPlants = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? plants
        : plants.filter((p) => (p.category ?? 'vegetable') === activeCategory);
    // Darstellung mit Garten-Zeitversatz (gespeicherte Daten bleiben unverändert)
    return applyGardenOffset(filtered, gardenOffset);
  }, [plants, activeCategory, gardenOffset]);

  const { open, done, next } = useMemo(() => {
    const current = getHalfMonthActivities(
      filteredPlants,
      currentMonth,
      yearForHalfMonthOffset(currentYear, currentMonth, 0),
      language,
      t
    );
    const nextMonth = (currentMonth + 1) % 24;
    return {
      open: current.filter((a) => !a.completion),
      done: current.filter((a) => a.completion),
      next: getHalfMonthActivities(
        filteredPlants,
        nextMonth,
        yearForHalfMonthOffset(currentYear, currentMonth, 1),
        language,
        t
      ),
    };
  }, [filteredPlants, currentMonth, currentYear, language, t]);

  const monthNames = t('agenda.months') as string[];
  const nextMonthName = monthNames[(currentMonth + 1) % 24];

  const subtitle = [
    monthNames[currentMonth],
    open.length === 0
      ? done.length > 0
        ? String(t('now.allDoneShort'))
        : null
      : open.length === 1
        ? String(t('now.countOne'))
        : String(t('now.countOther')).replace('{count}', String(open.length)),
  ]
    .filter(Boolean)
    .join(' · ');

  const hasAnyTask = open.length + done.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader large title={String(t('now.title'))} subtitle={subtitle} />
      <CategoryTabBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <ScrollView contentContainerStyle={styles.content} testID="now-scroll">
        {open.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {String(t('now.open'))}
            </Text>
            {open.map((activity) => (
              <ActivityCard
                key={`${activity.plantId}-${activity.activityId}`}
                activity={activity}
                onToggle={toggleDone}
                onEdit={openEditor}
              />
            ))}
          </>
        )}

        {open.length === 0 && (
          <Card elevation={1} padding={spacing.lg} style={styles.emptyCard}>
            <Icon
              name={hasAnyTask ? 'check' : 'sun'}
              size={28}
              color={hasAnyTask ? theme.success : theme.accent}
            />
            <View style={styles.emptyText}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {String(t(hasAnyTask ? 'now.allDoneTitle' : 'now.quietTitle'))}
              </Text>
              <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
                {String(t(hasAnyTask ? 'now.allDoneBody' : 'now.quietBody'))}
              </Text>
            </View>
          </Card>
        )}

        {done.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {String(t('now.done'))}
            </Text>
            {done.map((activity) => (
              <ActivityCard
                key={`${activity.plantId}-${activity.activityId}`}
                activity={activity}
                onToggle={toggleDone}
                onEdit={openEditor}
              />
            ))}
          </>
        )}

        {next.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {String(t('agenda.next'))} · {nextMonthName}
            </Text>
            <Card elevation={1} padding={spacing.md}>
              {next.slice(0, NEXT_PREVIEW_LIMIT).map((activity) => (
                <View
                  key={`${activity.plantId}-${activity.activityId}`}
                  style={styles.previewRow}
                  testID="now-next-row"
                >
                  <View style={[styles.dot, { backgroundColor: activity.activityColor }]} />
                  <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={1}>
                    {activity.plantEmoji} {activity.plantName} · {activity.activityLabel}
                  </Text>
                </View>
              ))}
              {next.length > NEXT_PREVIEW_LIMIT && (
                <Text style={[styles.more, { color: theme.textSecondary }]}>
                  {String(t('now.nextMore')).replace(
                    '{count}',
                    String(next.length - NEXT_PREVIEW_LIMIT)
                  )}
                </Text>
              )}
            </Card>
          </>
        )}

        <TouchableOpacity
          testID="now-all-upcoming"
          accessibilityRole="link"
          onPress={() => router.push('/agenda')}
          style={[
            styles.link,
            { borderColor: theme.border, backgroundColor: theme.surfaceElevated },
          ]}
        >
          <Icon name="agenda" size={18} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary }]}>
            {String(t('now.allUpcoming'))}
          </Text>
          <Icon name="chevronRight" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      {editor}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  emptyText: {
    flex: 1,
  },
  emptyTitle: {
    ...typography.h3,
  },
  emptyBody: {
    fontSize: 13,
    marginTop: 2,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewText: {
    flex: 1,
    fontSize: 14,
  },
  more: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
