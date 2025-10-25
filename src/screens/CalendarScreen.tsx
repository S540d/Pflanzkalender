import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { PlantRow } from '../components/PlantRow';
import { AddPlantModal } from '../components/AddPlantModal';
import { AddActivityModal } from '../components/AddActivityModal';
import { EditActivityModal } from '../components/EditActivityModal';
// import { AppHeader } from '../components/AppHeader'; // Temporär deaktiviert
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
  const fixedScrollRef = useRef<ScrollView>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  // Responsive: Portrait zeigt 6 2-Monats-Slots, Landscape zeigt 24 Halbmonate
  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  // Portrait: 6 Spalten (je 2 Monate), Landscape: 24 Halbmonate
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

  // Berechne aktuellen Halbmonat
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHalfMonth = currentMonth * 2 + (now.getDate() <= 15 ? 0 : 1);

  // Sortiere Pflanzen alphabetisch
  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }, [plants]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Lade Pflanzen...</Text>
      </View>
    );
  }
  const selectedPlant = sortedPlants.find((p) => p.id === selectedPlantId) || null;
  const selectedActivity = selectedPlant?.activities.find((a: any) => a.id === selectedActivityId) || null;

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
    // Im Portrait-Modus: Konvertiere 2-Monats-Slot-Index zu Halbmonat
    setSelectedMonth(isPortrait ? monthIndex * 4 : monthIndex);
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
      {/* AppHeader temporär deaktiviert - Navigation ist jetzt im Haupt-Header */}

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
            {sortedPlants.length === 0 ? (
              <View style={[styles.fixedPlantCell, { borderColor: theme.border }]}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>-</Text>
              </View>
            ) : (
              sortedPlants.map(plant => {
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
                <Text style={[styles.addPlantText, { color: theme.primary }]}>+ weitere Pflanze</Text>
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
            ref={headerScrollRef}
          >
            <View style={[styles.headerRow, { backgroundColor: theme.background }]}>
              {months.map((month, index) => {
                let isCurrentPeriod = false;

                if (isPortrait) {
                  // Im Portrait: Prüfe ob aktueller Halbmonat in diesem 2-Monats-Slot ist
                  const slotStart = index * 4;
                  const slotEnd = slotStart + 3;
                  isCurrentPeriod = currentHalfMonth >= slotStart && currentHalfMonth <= slotEnd;
                } else {
                  // Im Landscape: Wie bisher
                  isCurrentPeriod = index === currentHalfMonth;
                }

                return (
                  <View
                    key={index}
                    style={[
                      isPortrait ? styles.twoMonthCell : styles.monthCell,
                      {
                        borderColor: theme.border,
                        backgroundColor: isCurrentPeriod ? theme.border : theme.surface
                      }
                    ]}
                  >
                    <Text style={[styles.monthText, { color: theme.textSecondary }]}>
                      {isPortrait ? month : (index % 2 === 0 ? month : '')}
                    </Text>
                    {!isPortrait && (
                      <Text style={[styles.halfMonthText, { color: theme.textSecondary }]}>
                        {index % 2 === 0 ? '1' : '2'}
                      </Text>
                    )}
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
            onScroll={(e) => {
              if (headerScrollRef.current) {
                headerScrollRef.current.scrollTo({ x: e.nativeEvent.contentOffset.x, animated: false });
              }
            }}
            scrollEventThrottle={16}
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
            {sortedPlants.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Noch keine Pflanzen vorhanden.
                </Text>
              </View>
            ) : (
              sortedPlants.map(plant => {
                // Im Portrait: Konvertiere Halbmonate zu 2-Monats-Slots
                const visibleActivities = plant.activities.map(activity => {
                  if (isPortrait) {
                    // Konvertiere Halbmonat-Index zu 2-Monats-Slot-Index
                    // Slot 0: Halbmonate 0-3 (Jan-Feb)
                    // Slot 1: Halbmonate 4-7 (Mär-Apr)
                    // usw.
                    const startSlot = Math.floor(activity.startMonth / 4);
                    const endSlot = Math.floor(activity.endMonth / 4);
                    return {
                      ...activity,
                      id: activity.id,
                      startMonth: startSlot,
                      endMonth: endSlot,
                    };
                  }
                  // Landscape: Keine Änderung
                  return activity;
                });

                const visiblePlant = {
                  ...plant,
                  activities: visibleActivities,
                };

                const handleActivityClick = (activityId: string) => {
                  handlePressActivity(plant.id, activityId);
                };

                const handleMonthClick = (monthIndex: number) => {
                  handlePressMonth(plant.id, monthIndex);
                };

                return (
                  <PlantRow
                    key={plant.id}
                    plant={visiblePlant}
                    onPressActivity={handleActivityClick}
                    onPressMonth={handleMonthClick}
                    onPressPlant={() => {}}
                    totalMonths={months.length}
                    currentHalfMonth={isPortrait ? Math.floor(currentHalfMonth / 4) : currentHalfMonth}
                    monthOffset={0}
                    cellWidth={isPortrait ? 60 : 40}
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
  twoMonthCell: {
    width: 60,
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
