import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { PlantRow } from '../components/PlantRow';
import { AddPlantModal } from '../components/AddPlantModal';
import { AddActivityModal } from '../components/AddActivityModal';
import { EditActivityModal } from '../components/EditActivityModal';
import { AppHeader } from '../components/AppHeader';
import { calculateActivityRows } from '../utils/activityLayout';

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
  const fixedScrollRef = useRef<ScrollView>(null);

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

  // Berechne aktuellen Halbmonat
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHalfMonth = currentMonth * 2 + (now.getDate() <= 15 ? 0 : 1);

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
        <View style={styles.fixedColumn}>
          {/* Fixed Header - Pflanze */}
          <View style={[styles.fixedHeaderCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Text style={[styles.headerText, { color: theme.text }]}>Pflanze</Text>
          </View>

          {/* Fixed Plant Names */}
          <ScrollView
            style={styles.fixedColumnScroll}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ref={(ref) => {
              if (ref && !fixedScrollRef.current) {
                fixedScrollRef.current = ref;
              }
            }}
          >
            {plants.length === 0 ? (
              <View style={[styles.fixedPlantCell, { borderColor: theme.border }]}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>-</Text>
              </View>
            ) : (
              plants.map(plant => {
                // Calculate same height as PlantRow
                const activitiesWithRows = calculateActivityRows(plant.activities);
                const maxRow = activitiesWithRows.reduce((max, a) => Math.max(max, a.row), 0);
                const minHeight = Math.max(60, (maxRow + 1) * 28 + 8);
                
                return (
                  <View key={plant.id} style={[styles.fixedPlantCell, { borderColor: theme.border, backgroundColor: theme.surface, minHeight }]}>
                    <Text style={[styles.plantNameText, { color: theme.text }]} numberOfLines={2}>
                      {plant.name}
                    </Text>
                  </View>
                );
              })
            )}
            <View style={[styles.fixedPlantCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <TouchableOpacity onPress={() => setShowAddPlant(true)}>
                <Text style={[styles.addPlantText, { color: theme.primary }]}>+ Pflanze</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={styles.scrollableColumn}>
          {/* Sticky Header */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.stickyHeaderScroll}
            scrollEnabled={false}
            ref={(ref) => {
              // Will be synced with main horizontal scroll
            }}
          >
            <View style={[styles.headerRow, { backgroundColor: theme.background }]}>
              {months.map((month, index) => {
                const absoluteMonthIndex = index + (isSmallScreen ? monthOffset : 0);
                const isCurrentHalfMonth = absoluteMonthIndex === currentHalfMonth;

                return (
                  <View
                    key={index + monthOffset}
                    style={[
                      styles.monthCell,
                      {
                        borderColor: theme.border,
                        backgroundColor: isCurrentHalfMonth ? theme.border : theme.surface
                      }
                    ]}
                  >
                    <Text style={[styles.monthText, { color: theme.textSecondary }]}>
                      {index % 2 === 0 ? month : ''}
                    </Text>
                    <Text style={[styles.halfMonthText, { color: theme.textSecondary }]}>
                      {index % 2 === 0 ? '1' : '2'}
                    </Text>
                  </View>
                );
              })}
              <View style={[styles.notesCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <Text style={[styles.headerText, { color: theme.text }]}>Notizen</Text>
              </View>
            </View>
          </ScrollView>

          {/* Scrollable content */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            <ScrollView
              style={styles.verticalScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              onScroll={(e) => {
                if (fixedScrollRef.current) {
                  fixedScrollRef.current.scrollTo({ y: e.nativeEvent.contentOffset.y, animated: false });
                }
              }}
              scrollEventThrottle={16}
            >
              <View style={styles.tableWrapper}>
              {/* Pflanzenzeilen mit Aktivitätsbalken */}
            {plants.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Noch keine Pflanzen vorhanden.
                </Text>
              </View>
            ) : (
              plants.map(plant => {
                // Filtere Aktivitäten für sichtbare Monate und behalte Original-IDs
                const visibleActivities = plant.activities.filter(activity => {
                  const actStart = activity.startMonth;
                  const actEnd = activity.endMonth;
                  const rangeStart = isSmallScreen ? monthOffset : 0;
                  const rangeEnd = isSmallScreen ? monthOffset + monthsToShow - 1 : 23;

                  // Zeige Aktivität wenn sie den sichtbaren Bereich überlappt
                  return !(actEnd < rangeStart || actStart > rangeEnd);
                }).map(activity => ({
                  ...activity,
                  id: activity.id, // Explizit Original-ID beibehalten
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
                    totalMonths={months.length}
                    currentHalfMonth={currentHalfMonth}
                    monthOffset={isSmallScreen ? monthOffset : 0}
                  />
                );
              })
            )}
            </View>
          </ScrollView>
        </ScrollView>
        </View>
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
    flexDirection: 'row',
  },
  fixedColumn: {
    width: 120,
    zIndex: 10,
  },
  scrollableColumn: {
    flex: 1,
  },
  stickyHeaderScroll: {
    maxHeight: 60,
  },
  fixedHeaderCell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 60,
  },
  fixedColumnScroll: {
    flex: 1,
  },
  fixedPlantCell: {
    width: 120,
    minHeight: 60,
    padding: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    justifyContent: 'center',
  },
  plantNameText: {
    fontSize: 14,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    flexGrow: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  tableWrapper: {
    minWidth: '100%',
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
});
