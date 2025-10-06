import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { PlantRow } from '../components/PlantRow';
import { AddPlantModal } from '../components/AddPlantModal';
import { AddActivityModal } from '../components/AddActivityModal';
import { EditActivityModal } from '../components/EditActivityModal';
import { AppHeader } from '../components/AppHeader';

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants, loading, addPlant, addActivity, updateActivity, deleteActivity } = usePlants();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const allMonths = [
    'Jan', 'Jan', 'Feb', 'Feb', 'Mär', 'Mär',
    'Apr', 'Apr', 'Mai', 'Mai', 'Jun', 'Jun',
    'Jul', 'Jul', 'Aug', 'Aug', 'Sep', 'Sep',
    'Okt', 'Okt', 'Nov', 'Nov', 'Dez', 'Dez'
  ];

  // Responsive: Zeige 4-8 Halbmonate auf kleinen Screens, alle 24 auf großen
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 768;
  const monthsToShow = isSmallScreen ? 6 : 24; // 3 Monate auf kleinen Screens

  const months = useMemo(() => {
    if (isSmallScreen) {
      return allMonths.slice(monthOffset, monthOffset + monthsToShow);
    }
    return allMonths;
  }, [monthOffset, isSmallScreen]);

  const canGoBack = monthOffset > 0;
  const canGoForward = monthOffset + monthsToShow < 24;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Lade Pflanzen...</Text>
      </View>
    );
  }

  const selectedPlant = plants.find(p => p.id === selectedPlantId);
  const selectedActivity = selectedPlant?.activities.find(a => a.id === selectedActivityId) || null;

  const handleAddPlant = (name: string, notes: string) => {
    addPlant({ name, notes, isDefault: false, userId: null, activities: [] });
  };

  const handleAddActivity = (type: string, startMonth: number, endMonth: number, color: string, label: string) => {
    if (selectedPlantId) {
      addActivity(selectedPlantId, { type, startMonth, endMonth, color, label });
    }
  };

  const handlePressMonth = (plantId: string, monthIndex: number) => {
    setSelectedPlantId(plantId);
    setSelectedMonth(monthIndex);
    setShowAddActivity(true);
  };

  const handlePressActivity = (plantId: string, activityId: string) => {
    setSelectedPlantId(plantId);
    setSelectedActivityId(activityId);
    setShowEditActivity(true);
  };

  const handleUpdateActivity = (activityId: string, updates: any) => {
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
      <AppHeader
        rightContent={
          isSmallScreen ? (
            <View style={styles.navButtons}>
              <TouchableOpacity
                style={[styles.navButton, { opacity: canGoBack ? 1 : 0.3 }]}
                onPress={() => canGoBack && setMonthOffset(monthOffset - monthsToShow)}
                disabled={!canGoBack}
              >
                <Text style={[styles.navButtonText, { color: theme.text }]}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, { opacity: canGoForward ? 1 : 0.3 }]}
                onPress={() => canGoForward && setMonthOffset(monthOffset + monthsToShow)}
                disabled={!canGoForward}
              >
                <Text style={[styles.navButtonText, { color: theme.text }]}>→</Text>
              </TouchableOpacity>
            </View>
          ) : undefined
        }
      />

      <View style={styles.tableContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScroll}
        >
          <ScrollView
            style={styles.verticalScroll}
            showsVerticalScrollIndicator={true}
          >
            <View>
            {/* Header mit Monaten */}
            <View style={[styles.headerRow, { backgroundColor: theme.background }]}>
              <View style={[styles.plantNameCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <Text style={[styles.headerText, { color: theme.text }]}>Pflanze</Text>
              </View>
              {months.map((month, index) => (
                <View key={index + monthOffset} style={[styles.monthCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                  <Text style={[styles.monthText, { color: theme.textSecondary }]}>
                    {index % 2 === 0 ? month : ''}
                  </Text>
                  <Text style={[styles.halfMonthText, { color: theme.textSecondary }]}>
                    {index % 2 === 0 ? '1' : '2'}
                  </Text>
                </View>
              ))}
              <View style={[styles.notesCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <Text style={[styles.headerText, { color: theme.text }]}>Notizen</Text>
              </View>
            </View>
            {/* Pflanzenzeilen mit Aktivitätsbalken */}
            {plants.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Noch keine Pflanzen vorhanden.
                </Text>
              </View>
            ) : (
              plants.map(plant => {
                // Filtere Aktivitäten für sichtbare Monate
                const visibleActivities = plant.activities.filter(activity => {
                  const actStart = activity.startMonth;
                  const actEnd = activity.endMonth;
                  const rangeStart = isSmallScreen ? monthOffset : 0;
                  const rangeEnd = isSmallScreen ? monthOffset + monthsToShow - 1 : 23;

                  // Zeige Aktivität wenn sie den sichtbaren Bereich überlappt
                  return !(actEnd < rangeStart || actStart > rangeEnd);
                }).map(activity => ({
                  ...activity,
                  // Passe Start/End an sichtbaren Bereich an
                  startMonth: Math.max(0, activity.startMonth - (isSmallScreen ? monthOffset : 0)),
                  endMonth: Math.min(
                    months.length - 1,
                    activity.endMonth - (isSmallScreen ? monthOffset : 0)
                  ),
                }));

                const visiblePlant = {
                  ...plant,
                  activities: visibleActivities,
                };

                // Debug: Log when activity is clicked
                const handleActivityClick = (activityId: string) => {
                  handlePressActivity(plant.id, activityId);
                };

                const handleMonthClick = (monthIndex: number) => {
                  handlePressMonth(plant.id, monthIndex + (isSmallScreen ? monthOffset : 0));
                };

                return (
                  <PlantRow
                    key={plant.id}
                    plant={visiblePlant}
                    onPressActivity={handleActivityClick}
                    onPressMonth={handleMonthClick}
                    onPressPlant={() => {}}
                  />
                );
              })
            )}

            {/* + Pflanze Button Zeile */}
            <View style={styles.addPlantRow}>
              <TouchableOpacity
                style={[styles.addPlantCell, { borderColor: theme.border, backgroundColor: theme.surface }]}
                onPress={() => setShowAddPlant(true)}
              >
                <Text style={[styles.addPlantText, { color: theme.primary }]}>+ Pflanze</Text>
              </TouchableOpacity>
              {months.map((month, index) => (
                <View key={index} style={[styles.monthCell, { borderColor: theme.border }]} />
              ))}
              <View style={[styles.notesCell, { borderColor: theme.border }]} />
            </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.supportLink}
          onPress={() => Linking.openURL('https://buymeacoffee.com/sven4321')}
        >
          <Text style={[styles.supportText, { color: theme.textSecondary }]}>
            ☕ Support me
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AddPlantModal
        visible={showAddPlant}
        onClose={() => setShowAddPlant(false)}
        onAdd={handleAddPlant}
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
  tableContainer: {
    flex: 1,
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addPlantRow: {
    flexDirection: 'row',
  },
  addPlantCell: {
    width: 120,
    minHeight: 60,
    padding: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlantText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
  },
  plantNameCell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    justifyContent: 'center',
  },
  monthCell: {
    width: 40,
    padding: 4,
    borderWidth: 1,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesCell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  monthText: {
    fontSize: 10,
    fontWeight: '500',
  },
  halfMonthText: {
    fontSize: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  supportLink: {
    padding: 4,
  },
  supportText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
