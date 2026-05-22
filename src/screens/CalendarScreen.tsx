import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { usePlants } from '../contexts/PlantContext';
import { AddActivityModal } from '../components/AddActivityModal';
import { EditActivityModal } from '../components/EditActivityModal';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { TableHeader } from '../components/TableHeader';
import { PlantRowsContainer } from '../components/PlantRowsContainer';
import { CategoryFilter } from '../constants/categoryTabs';
import { Activity } from '../types';

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { plants, loading, addActivity, updateActivity, deleteActivity } = usePlants();
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [zoomLevel, setZoomLevel] = useState(2);
  const fixedScrollRef = useRef<ScrollView>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  const ZOOM_LEVELS = isPortrait ? [40, 60, 80] : [28, 40, 56];
  const cellWidth = ZOOM_LEVELS[zoomLevel - 1] ?? ZOOM_LEVELS[1];

  const months = useMemo(() => {
    const shortNames = t('calendar.months.short') as string[];
    if (isPortrait) {
      return [
        `${shortNames[0]}-${shortNames[1]}`,
        `${shortNames[2]}-${shortNames[3]}`,
        `${shortNames[4]}-${shortNames[5]}`,
        `${shortNames[6]}-${shortNames[7]}`,
        `${shortNames[8]}-${shortNames[9]}`,
        `${shortNames[10]}-${shortNames[11]}`,
      ];
    }
    return shortNames.flatMap((m) => [m, m]);
  }, [isPortrait, t]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHalfMonth = currentMonth * 2 + (now.getDate() <= 15 ? 0 : 1);

  const sortedPlants = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? plants
        : plants.filter((p) => (p.category ?? 'vegetable') === activeCategory);
    return filtered.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }, [plants, activeCategory]);

  const selectedPlant = sortedPlants.find((p) => p.id === selectedPlantId) || null;
  const selectedActivity =
    selectedPlant?.activities.find((a) => a.id === selectedActivityId) || null;

  const handleAddActivity = (
    type: string,
    startMonth: number,
    endMonth: number,
    color: string,
    label: string
  ) => {
    if (selectedPlantId) {
      addActivity(selectedPlantId, { type, startMonth, endMonth, color, label });
    }
  };

  const handlePressMonth = (plantId: string, monthIndex: number) => {
    setSelectedPlantId(plantId);
    setSelectedMonth(isPortrait ? monthIndex * 4 : monthIndex);
    setSelectedEndMonth(undefined);
    setShowAddActivity(true);
  };

  const handlePressMonthRange = (plantId: string, startIdx: number, endIdx: number) => {
    setSelectedPlantId(plantId);
    const startHalf = isPortrait ? startIdx * 4 : startIdx;
    const endHalf = isPortrait ? Math.min(endIdx * 4 + 3, 23) : endIdx;
    setSelectedMonth(startHalf);
    setSelectedEndMonth(endHalf);
    setShowAddActivity(true);
  };

  const handlePressActivity = (plantId: string, activityId: string) => {
    setSelectedPlantId(plantId);
    setSelectedActivityId(activityId);
    setShowEditActivity(true);
  };

  const handleUpdateActivity = (activityId: string, updates: Partial<Activity>) => {
    if (selectedPlantId) {
      updateActivity(selectedPlantId, activityId, updates);
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    if (selectedPlantId) {
      deleteActivity(selectedPlantId, activityId);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CategoryTabBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <View
        style={[
          styles.zoomBar,
          { backgroundColor: theme.background, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity
          testID="zoom-out"
          accessibilityRole="button"
          accessibilityLabel="Zoom out"
          accessibilityHint="Reduces calendar cell size to show more months"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.zoomButton, { opacity: zoomLevel <= 1 ? 0.3 : 1 }]}
          onPress={() => setZoomLevel((l) => Math.max(1, l - 1))}
          disabled={zoomLevel <= 1}
        >
          <Text style={[styles.zoomButtonText, { color: theme.text }]}>−</Text>
        </TouchableOpacity>
        <Text testID="zoom-label" style={[styles.zoomLabel, { color: theme.textSecondary }]}>
          {zoomLevel === 1 ? '75%' : zoomLevel === 2 ? '100%' : '133%'}
        </Text>
        <TouchableOpacity
          testID="zoom-in"
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
          accessibilityHint="Increases calendar cell size for easier tapping"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.zoomButton, { opacity: zoomLevel >= 3 ? 0.3 : 1 }]}
          onPress={() => setZoomLevel((l) => Math.min(3, l + 1))}
          disabled={zoomLevel >= 3}
        >
          <Text style={[styles.zoomButtonText, { color: theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      <TableHeader
        months={months}
        isPortrait={isPortrait}
        currentHalfMonth={currentHalfMonth}
        cellWidth={cellWidth}
        headerScrollRef={headerScrollRef}
      />

      <PlantRowsContainer
        sortedPlants={sortedPlants}
        isPortrait={isPortrait}
        currentHalfMonth={currentHalfMonth}
        months={months}
        cellWidth={cellWidth}
        onPressActivity={handlePressActivity}
        onPressMonth={handlePressMonth}
        onPressMonthRange={handlePressMonthRange}
        fixedScrollRef={fixedScrollRef}
        headerScrollRef={headerScrollRef}
        loading={loading}
      />

      {selectedPlant && (
        <AddActivityModal
          visible={showAddActivity}
          plantName={selectedPlant.name}
          initialMonth={selectedMonth}
          initialEndMonth={selectedEndMonth}
          onClose={() => setShowAddActivity(false)}
          onAdd={handleAddActivity}
        />
      )}

      {selectedPlant && (
        <EditActivityModal
          visible={showEditActivity}
          activity={selectedActivity}
          plantName={selectedPlant.name}
          onClose={() => setShowEditActivity(false)}
          onUpdate={handleUpdateActivity}
          onDelete={handleDeleteActivity}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  zoomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    gap: 8,
  },
  zoomButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  zoomLabel: {
    fontSize: 11,
    minWidth: 36,
    textAlign: 'center',
  },
});
