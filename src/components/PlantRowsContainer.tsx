import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Plant } from '../types';
import { PlantRow } from './PlantRow';
import { calculateActivityRows } from '../utils/activityLayout';

interface PlantRowsContainerProps {
  sortedPlants: Plant[];
  isPortrait: boolean;
  currentHalfMonth: number;
  months: string[];
  onPressActivity: (plantId: string, activityId: string) => void;
  onPressMonth: (plantId: string, monthIndex: number) => void;
  onFixedScrollOffset?: (offset: number) => void;
  fixedScrollRef?: React.RefObject<ScrollView>;
  headerScrollRef?: React.RefObject<ScrollView>;
  loading?: boolean;
}

export const PlantRowsContainer: React.FC<PlantRowsContainerProps> = ({
  sortedPlants,
  isPortrait,
  currentHalfMonth,
  months,
  onPressActivity,
  onPressMonth,
  onFixedScrollOffset,
  fixedScrollRef: externalFixedScrollRef,
  headerScrollRef,
  loading = false,
}) => {
  const { theme } = useTheme();
  const localFixedScrollRef = useRef<ScrollView>(null);
  const fixedScrollRef = externalFixedScrollRef || localFixedScrollRef;

  return (
    <View style={styles.tableContainer}>
      {/* Fixed Column */}
      <View style={styles.fixedColumn}>
        {/* Fixed Header */}
        <View style={[styles.fixedHeaderCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <Text style={[styles.headerText, { color: theme.text }]}>Pflanze</Text>
        </View>

        {/* Fixed Plant Names */}
        <ScrollView
          style={styles.fixedColumnScroll}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ref={fixedScrollRef}
        >
          {sortedPlants.length === 0 ? (
            <View style={[styles.fixedPlantCell, { borderColor: theme.border }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>-</Text>
            </View>
          ) : (
            sortedPlants.map(plant => {
              const visibleActivities = plant.activities.map(activity => {
                if (isPortrait) {
                  const startSlot = Math.floor(activity.startMonth / 4);
                  const endSlot = Math.floor(activity.endMonth / 4);
                  return {
                    ...activity,
                    startMonth: startSlot,
                    endMonth: endSlot,
                  };
                }
                return activity;
              });

              const activitiesWithRows = calculateActivityRows(visibleActivities);
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
        </ScrollView>
      </View>

      {/* Scrollable Column */}
      <View style={styles.scrollableColumn}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalContent}
          onScroll={(e) => {
            if (headerScrollRef?.current) {
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
              onFixedScrollOffset?.(e.nativeEvent.contentOffset.y);
            }}
            scrollEventThrottle={16}
          >
            <View style={styles.tableWrapper}>
              {loading ? (
                <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                  <ActivityIndicator size="large" color={theme.primary} />
                </View>
              ) : sortedPlants.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    Noch keine Pflanzen vorhanden.
                  </Text>
                </View>
              ) : (
                sortedPlants.map(plant => {
                  const visibleActivities = plant.activities.map(activity => {
                    if (isPortrait) {
                      const startSlot = Math.floor(activity.startMonth / 4);
                      const endSlot = Math.floor(activity.endMonth / 4);
                      return {
                        ...activity,
                        startMonth: startSlot,
                        endMonth: endSlot,
                      };
                    }
                    return activity;
                  });

                  const visiblePlant = {
                    ...plant,
                    activities: visibleActivities,
                  };

                  return (
                    <PlantRow
                      key={plant.id}
                      plant={visiblePlant}
                      onPressActivity={(activityId) => onPressActivity(plant.id, activityId)}
                      onPressMonth={(monthIndex) => onPressMonth(plant.id, monthIndex)}
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
  );
};

const styles = StyleSheet.create({
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
  headerText: {
    fontSize: 14,
    fontWeight: '600',
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
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
