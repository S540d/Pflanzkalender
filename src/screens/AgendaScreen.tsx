import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { AppHeader } from '../components/AppHeader';

interface ActivityInfo {
  plantName: string;
  activityLabel: string;
  activityColor: string;
  notes?: string;
}

export const AgendaScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants } = usePlants();

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

    return activities;
  };

  const previousActivities = useMemo(() => getActivitiesForMonth(previousMonth), [plants, previousMonth]);
  const currentActivities = useMemo(() => getActivitiesForMonth(currentMonth), [plants, currentMonth]);
  const nextActivities = useMemo(() => getActivitiesForMonth(nextMonth), [plants, nextMonth]);

  const monthNames = [
    'Jan 1-15', 'Jan 16-31', 'Feb 1-15', 'Feb 16-28', 'Mär 1-15', 'Mär 16-31',
    'Apr 1-15', 'Apr 16-30', 'Mai 1-15', 'Mai 16-31', 'Jun 1-15', 'Jun 16-30',
    'Jul 1-15', 'Jul 16-31', 'Aug 1-15', 'Aug 16-31', 'Sep 1-15', 'Sep 16-30',
    'Okt 1-15', 'Okt 16-31', 'Nov 1-15', 'Nov 16-30', 'Dez 1-15', 'Dez 16-31',
  ];

  const renderColumn = (title: string, activities: ActivityInfo[], monthIndex: number) => (
    <View style={styles.column}>
      <Text style={[styles.columnTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.columnSubtitle, { color: theme.textSecondary }]}>
        {monthNames[monthIndex]}
      </Text>

      {activities.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Keine Aktivitäten
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
      <AppHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.columnsContainer}>
          {renderColumn('Vorher', previousActivities, previousMonth)}
          {renderColumn('Aktuell', currentActivities, currentMonth)}
          {renderColumn('Demnächst', nextActivities, nextMonth)}
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
    flex: 1,
    minWidth: 250,
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
