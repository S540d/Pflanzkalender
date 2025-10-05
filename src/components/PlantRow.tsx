import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plant } from '../types';
import { ActivityBar } from './ActivityBar';
import { useTheme } from '../hooks/useTheme';

interface PlantRowProps {
  plant: Plant;
  onPressActivity?: (activityId: string) => void;
  onPressMonth?: (monthIndex: number) => void;
  onPressPlant?: () => void;
}

export const PlantRow: React.FC<PlantRowProps> = ({
  plant,
  onPressActivity,
  onPressMonth,
  onPressPlant,
}) => {
  const { theme } = useTheme();

  const months = Array.from({ length: 24 }, (_, i) => i);

  // Berechne minimale Höhe basierend auf Anzahl der Aktivitäten
  const minHeight = Math.max(60, plant.activities.length * 28 + 8);

  return (
    <View style={[styles.row, { minHeight }]}>
      {/* Pflanzenname */}
      <TouchableOpacity
        style={[styles.plantNameCell, { borderColor: theme.border }]}
        onPress={onPressPlant}
      >
        <Text style={[styles.plantName, { color: theme.text }]} numberOfLines={2}>
          {plant.name}
        </Text>
        {plant.isDefault && (
          <Text style={[styles.defaultBadge, { color: theme.textSecondary }]}>●</Text>
        )}
      </TouchableOpacity>

      {/* Monats-Zellen mit Aktivitäten */}
      <View style={styles.monthsContainer}>
        {months.map(monthIndex => (
          <TouchableOpacity
            key={monthIndex}
            style={[styles.monthCell, { borderColor: theme.border }]}
            onPress={() => onPressMonth?.(monthIndex)}
          />
        ))}

        {/* Aktivitätsbalken über den Monaten */}
        <View style={styles.activitiesLayer}>
          {plant.activities.map((activity, index) => (
            <View
              key={activity.id}
              style={[styles.activityContainer, { top: index * 28 }]}
            >
              <ActivityBar
                activity={activity}
                onPress={() => onPressActivity?.(activity.id)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Notizen */}
      <View style={[styles.notesCell, { borderColor: theme.border }]}>
        <Text style={[styles.notes, { color: theme.textSecondary }]} numberOfLines={2}>
          {plant.notes}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    minHeight: 60,
  },
  plantNameCell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    justifyContent: 'center',
  },
  plantName: {
    fontSize: 14,
    fontWeight: '500',
  },
  defaultBadge: {
    fontSize: 8,
    marginTop: 2,
  },
  monthsContainer: {
    flexDirection: 'row',
    flex: 1,
    position: 'relative',
  },
  monthCell: {
    width: 40,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  notesCell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: 'center',
  },
  notes: {
    fontSize: 11,
  },
  activitiesLayer: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activityContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
  },
});
