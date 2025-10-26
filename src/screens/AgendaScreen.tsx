import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
// import { AppHeader } from '../components/AppHeader'; // Temporär deaktiviert

interface ActivityInfo {
  plantName: string;
  activityLabel: string;
  activityColor: string;
  notes?: string;
}

export const AgendaScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants } = usePlants();
  const { t } = useLanguage();

  // Aktuellen Monat bestimmen (0-23 Halbmonate)
  const currentMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();
    const halfMonth = day <= 15 ? 0 : 1;
    return month * 2 + halfMonth;
  }, []);

  // Aktivitäten für drei Zeiträume sammeln (vorher, aktuell, danach)
  const previousMonth = currentMonth > 0 ? currentMonth - 1 : 23;
  const nextMonth = currentMonth < 23 ? currentMonth + 1 : 0;

  const getActivitiesForMonth = (monthIndex: number): ActivityInfo[] => {
    const activities: ActivityInfo[] = [];

    plants.forEach(plant => {
      plant.activities.forEach(activity => {
        if (activity.startMonth <= monthIndex && activity.endMonth >= monthIndex) {
          activities.push({
            plantName: plant.name,
            activityLabel: activity.label,
            activityColor: activity.color,
            notes: plant.notes,
          });
        }
      });
    });

    // Sortiere Aktivitäten alphabetisch nach Pflanzennamen
    return activities.sort((a, b) => a.plantName.localeCompare(b.plantName, 'de'));
  };

  const previousActivities = useMemo(() => getActivitiesForMonth(previousMonth), [plants, previousMonth]);
  const currentActivities = useMemo(() => getActivitiesForMonth(currentMonth), [plants, currentMonth]);
  const nextActivities = useMemo(() => getActivitiesForMonth(nextMonth), [plants, nextMonth]);

  const monthNames = t('agenda.months') as any;

  const renderColumn = (title: string, activities: ActivityInfo[], monthIndex: number) => (
    <View style={styles.column}>
      <Text style={[styles.columnTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.columnSubtitle, { color: theme.textSecondary }]}>
        {monthNames[monthIndex]}
      </Text>

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
              {activity.plantName}
            </Text>
            {activity.notes && (
              <Text style={[styles.notes, { color: theme.textSecondary }]}>
                {activity.notes}
              </Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <AppHeader /> Temporär deaktiviert */}
      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.columnsContainer}>
          {renderColumn(t('agenda.previous'), previousActivities, previousMonth)}
          {renderColumn(t('agenda.current'), currentActivities, currentMonth)}
          {renderColumn(t('agenda.next'), nextActivities, nextMonth)}
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
    padding: 16,
    gap: 16,
  },
  column: {
    width: 160,
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
