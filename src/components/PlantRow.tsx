import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Plant } from '../types';
import { ActivityBar } from './ActivityBar';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { calculateActivityRows } from '../utils/activityLayout';

interface PlantRowProps {
  plant: Plant;
  onPressActivity?: (activityId: string) => void;
  onPressMonth?: (monthIndex: number) => void;
  onPressPlant?: () => void;
  totalMonths?: number; // Anzahl der sichtbaren Monate
  currentHalfMonth?: number; // Aktueller Halbmonat (0-23)
  monthOffset?: number; // Offset für mobile Ansicht
}

export const PlantRow: React.FC<PlantRowProps> = ({
  plant,
  onPressActivity,
  onPressMonth,
  onPressPlant,
  totalMonths = 24,
  currentHalfMonth,
  monthOffset = 0,
}) => {
  const { theme } = useTheme();
  const { updatePlant } = usePlants();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(plant.notes);

  const months = Array.from({ length: totalMonths }, (_, i) => i);

  // Berechne kompakte Zeilen für Aktivitäten
  const activitiesWithRows = useMemo(
    () => calculateActivityRows(plant.activities),
    [plant.activities]
  );

  // Berechne minimale Höhe basierend auf Anzahl der Zeilen
  const maxRow = activitiesWithRows.reduce((max, a) => Math.max(max, a.row), 0);
  const minHeight = Math.max(60, (maxRow + 1) * 28 + 8);

  const handleNotesPress = () => {
    setIsEditingNotes(true);
  };

  const handleNotesSubmit = () => {
    setIsEditingNotes(false);
    if (notesText !== plant.notes) {
      updatePlant(plant.id, { notes: notesText });
    }
  };

  const handleNotesBlur = () => {
    handleNotesSubmit();
  };

  return (
    <View style={[styles.row, { minHeight }]}>
      {/* Monats-Zellen mit Aktivitäten */}
      <View style={styles.monthsContainer}>
        {months.map(monthIndex => {
          const absoluteMonthIndex = monthIndex + monthOffset;
          const isCurrentHalfMonth = currentHalfMonth !== undefined && absoluteMonthIndex === currentHalfMonth;

          return (
            <TouchableOpacity
              key={monthIndex}
              style={[
                styles.monthCell,
                {
                  borderColor: theme.border,
                  backgroundColor: isCurrentHalfMonth ? theme.border : 'transparent'
                }
              ]}
              onPress={() => onPressMonth?.(monthIndex)}
            />
          );
        })}

        {/* Aktivitätsbalken über den Monaten */}
        <View style={styles.activitiesLayer}>
          {activitiesWithRows.map((activity) => (
            <View
              key={activity.id}
              style={[styles.activityContainer, { top: activity.row * 28 }]}
            >
              <ActivityBar
                activity={activity}
                onPress={() => onPressActivity?.(activity.id)}
                totalMonths={totalMonths}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Notizen */}
      <View style={[styles.notesCell, { borderColor: theme.border }]}>
        {isEditingNotes ? (
          <TextInput
            style={[styles.notesInput, { color: theme.textSecondary }]}
            value={notesText}
            onChangeText={setNotesText}
            onSubmitEditing={handleNotesSubmit}
            onBlur={handleNotesBlur}
            multiline
            numberOfLines={2}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={handleNotesPress}>
            <Text style={[styles.notes, { color: theme.textSecondary }]} numberOfLines={2}>
              {plant.notes || 'Notizen hinzufügen...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    minHeight: 60,
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
  notesInput: {
    fontSize: 11,
    padding: 0,
    minHeight: 30,
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
