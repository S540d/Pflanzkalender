import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { AddActivityModal } from '../components/AddActivityModal';
import { EditActivityModal } from '../components/EditActivityModal';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { TableHeader } from '../components/TableHeader';
import { PlantRowsContainer } from '../components/PlantRowsContainer';
import { CategoryFilter } from '../constants/categoryTabs';

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants, loading, addActivity, updateActivity, deleteActivity } = usePlants();
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const fixedScrollRef = useRef<ScrollView>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  const months = useMemo(() => {
    if (isPortrait) {
      return ['Jan-Feb', 'Mär-Apr', 'Mai-Jun', 'Jul-Aug', 'Sep-Okt', 'Nov-Dez'];
    }
    return [
      'Jan', 'Jan', 'Feb', 'Feb', 'Mär', 'Mär',
      'Apr', 'Apr', 'Mai', 'Mai', 'Jun', 'Jun',
      'Jul', 'Jul', 'Aug', 'Aug', 'Sep', 'Sep',
      'Okt', 'Okt', 'Nov', 'Nov', 'Dez', 'Dez'
    ];
  }, [isPortrait]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHalfMonth = currentMonth * 2 + (now.getDate() <= 15 ? 0 : 1);

  const sortedPlants = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? plants
      : plants.filter(p => (p.category ?? 'vegetable') === activeCategory);
    return filtered.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }, [plants, activeCategory]);

  const selectedPlant = sortedPlants.find((p) => p.id === selectedPlantId) || null;
  const selectedActivity = selectedPlant?.activities.find((a) => a.id === selectedActivityId) || null;

  const handleAddActivity = (type: string, startMonth: number, endMonth: number, color: string, label: string) => {
    if (selectedPlantId) {
      addActivity(selectedPlantId, { type, startMonth, endMonth, color, label });
    }
  };

  const handlePressMonth = (plantId: string, monthIndex: number) => {
    setSelectedPlantId(plantId);
    setSelectedMonth(isPortrait ? monthIndex * 4 : monthIndex);
    setShowAddActivity(true);
  };

  const handlePressActivity = (plantId: string, activityId: string) => {
    setSelectedPlantId(plantId);
    setSelectedActivityId(activityId);
    setShowEditActivity(true);
  };

  const handleUpdateActivity = (activityId: string, updates: Record<string, unknown>) => {
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

      <TableHeader
        months={months}
        isPortrait={isPortrait}
        currentHalfMonth={currentHalfMonth}
        headerScrollRef={headerScrollRef}
      />

      <PlantRowsContainer
        sortedPlants={sortedPlants}
        isPortrait={isPortrait}
        currentHalfMonth={currentHalfMonth}
        months={months}
        onPressActivity={handlePressActivity}
        onPressMonth={handlePressMonth}
        fixedScrollRef={fixedScrollRef}
        headerScrollRef={headerScrollRef}
        loading={loading}
      />

      {selectedPlant && (
        <AddActivityModal
          visible={showAddActivity}
          plantName={selectedPlant.name}
          initialMonth={selectedMonth}
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
});
