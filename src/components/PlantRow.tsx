import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Plant } from '../types';
import { ActivityBar } from './ActivityBar';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { calculateActivityRows } from '../utils/activityLayout';

interface MonthCellWebProps {
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  style?: React.ComponentProps<typeof View>['style'];
}

interface PlantRowProps {
  plant: Plant;
  onPressActivity?: (activityId: string) => void;
  onPressMonth?: (monthIndex: number) => void;
  onPressMonthRange?: (startMonth: number, endMonth: number) => void;
  onPressPlant?: () => void;
  totalMonths?: number; // Anzahl der sichtbaren Monate
  currentHalfMonth?: number; // Aktueller Halbmonat (0-23)
  monthOffset?: number; // Offset für mobile Ansicht
  cellWidth?: number; // Breite der Monatszellen
}

export const PlantRow: React.FC<PlantRowProps> = ({
  plant,
  onPressActivity,
  onPressMonth,
  onPressMonthRange,
  onPressPlant: _onPressPlant,
  totalMonths = 24,
  currentHalfMonth,
  monthOffset = 0,
  cellWidth = 40,
}) => {
  const { theme } = useTheme();
  const { updatePlant } = usePlants();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(plant.notes);

  // Drag-to-create state (web only)
  const [dragPreview, setDragPreview] = useState<{ startMonth: number; endMonth: number } | null>(
    null
  );
  const dragStateRef = useRef<{ startMonth: number; endMonth: number } | null>(null);
  const onPressMonthRef = useRef(onPressMonth);
  const onPressMonthRangeRef = useRef(onPressMonthRange);
  useEffect(() => {
    onPressMonthRef.current = onPressMonth;
  }, [onPressMonth]);
  useEffect(() => {
    onPressMonthRangeRef.current = onPressMonthRange;
  }, [onPressMonthRange]);

  // Global mouseup listener to finalize drag (web only, registered only during active drag)
  useEffect(() => {
    if (Platform.OS !== 'web' || !dragStateRef.current) return;
    const handleMouseUp = () => {
      const ds = dragStateRef.current;
      if (!ds) return;
      const start = Math.min(ds.startMonth, ds.endMonth);
      const end = Math.max(ds.startMonth, ds.endMonth);
      if (start !== end) {
        onPressMonthRangeRef.current?.(start, end);
      } else {
        onPressMonthRef.current?.(start);
      }
      dragStateRef.current = null;
      setDragPreview(null);
    };
    window.addEventListener('mouseup', handleMouseUp); // platform-safe
    return () => window.removeEventListener('mouseup', handleMouseUp); // platform-safe
  }, [dragPreview]);

  const handleCellMouseDown = useCallback((e: React.MouseEvent, monthIndex: number) => {
    e.preventDefault();
    dragStateRef.current = { startMonth: monthIndex, endMonth: monthIndex };
    setDragPreview({ startMonth: monthIndex, endMonth: monthIndex });
  }, []);

  const handleCellMouseEnter = useCallback((monthIndex: number) => {
    if (!dragStateRef.current) return;
    dragStateRef.current.endMonth = monthIndex;
    setDragPreview({ startMonth: dragStateRef.current.startMonth, endMonth: monthIndex });
  }, []);

  const months = Array.from({ length: totalMonths }, (_, i) => i);
  const gridWidth = totalMonths * cellWidth;

  const activitiesWithRows = useMemo(
    () => calculateActivityRows(plant.activities),
    [plant.activities]
  );

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

  // Compute drag preview bar dimensions
  const dragPreviewBar =
    dragPreview !== null
      ? (() => {
          const start = Math.min(dragPreview.startMonth, dragPreview.endMonth);
          const end = Math.max(dragPreview.startMonth, dragPreview.endMonth);
          return {
            left: `${(start / totalMonths) * 100}%`,
            width: `${((end - start + 1) / totalMonths) * 100}%`,
          };
        })()
      : null;

  return (
    <View style={[styles.row, { minHeight }]}>
      <View
        style={[
          styles.monthsContainer,
          { width: gridWidth },
          Platform.OS === 'web'
            ? ({ userSelect: 'none' } as React.ComponentProps<typeof View>['style'])
            : undefined,
        ]}
      >
        {months.map((monthIndex) => {
          const absoluteMonthIndex = monthIndex + monthOffset;
          const isCurrentHalfMonth =
            currentHalfMonth !== undefined && absoluteMonthIndex === currentHalfMonth;

          const baseStyle = [
            styles.monthCell,
            {
              width: cellWidth,
              borderColor: theme.border,
              backgroundColor: isCurrentHalfMonth ? theme.border : 'transparent',
            },
          ];

          if (Platform.OS === 'web') {
            const webProps: MonthCellWebProps = {
              onMouseDown: (e: React.MouseEvent) => handleCellMouseDown(e, monthIndex),
              onMouseEnter: () => handleCellMouseEnter(monthIndex),
              style: [
                ...baseStyle,
                { cursor: 'crosshair' } as React.ComponentProps<typeof View>['style'],
              ],
            };
            return <View key={monthIndex} {...(webProps as React.ComponentProps<typeof View>)} />;
          }

          return (
            <TouchableOpacity
              key={monthIndex}
              style={baseStyle}
              onPress={() => onPressMonth?.(monthIndex)}
            />
          );
        })}

        <View style={styles.activitiesLayer} pointerEvents="box-none">
          {activitiesWithRows.map((activity) => (
            <View key={activity.id} style={[styles.activityContainer, { top: activity.row * 28 }]}>
              <ActivityBar
                activity={activity}
                onPress={() => onPressActivity?.(activity.id)}
                totalMonths={totalMonths}
              />
            </View>
          ))}
          {/* Drag preview bar */}
          {dragPreviewBar && (
            <View
              pointerEvents="none"
              style={[
                styles.dragPreviewBar,
                {
                  left: dragPreviewBar.left,
                  width: dragPreviewBar.width,
                  backgroundColor: theme.primary + '55',
                  borderColor: theme.primary,
                },
              ]}
            />
          )}
          {/* Empty row hint */}
          {plant.activities.length === 0 && !dragPreview && Platform.OS === 'web' && (
            <View style={styles.emptyHint} pointerEvents="none">
              <Text style={[styles.emptyHintText, { color: theme.textSecondary }]}>
                {'← Klicken oder ziehen →'}
              </Text>
            </View>
          )}
        </View>
      </View>

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
  dragPreviewBar: {
    position: 'absolute',
    top: 0,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyHint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHintText: {
    fontSize: 10,
    opacity: 0.5,
  },
});
