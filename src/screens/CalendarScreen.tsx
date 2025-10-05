import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { PlantRow } from '../components/PlantRow';
import { AddPlantModal } from '../components/AddPlantModal';
import { AddActivityModal } from '../components/AddActivityModal';

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants, loading, addPlant, addActivity } = usePlants();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const months = [
    'Jan', 'Jan', 'Feb', 'Feb', 'Mär', 'Mär',
    'Apr', 'Apr', 'Mai', 'Mai', 'Jun', 'Jun',
    'Jul', 'Jul', 'Aug', 'Aug', 'Sep', 'Sep',
    'Okt', 'Okt', 'Nov', 'Nov', 'Dez', 'Dez'
  ];

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Lade Pflanzen...</Text>
      </View>
    );
  }

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Pflanzkalender</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddPlant(true)}
        >
          <Text style={styles.addButtonText}>+ Pflanze</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {/* Header mit Monaten */}
            <View style={styles.headerRow}>
              <View style={[styles.plantNameCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <Text style={[styles.headerText, { color: theme.text }]}>Pflanze</Text>
              </View>
              {months.map((month, index) => (
                <View key={index} style={[styles.monthCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
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
              plants.map(plant => (
                <PlantRow
                  key={plant.id}
                  plant={plant}
                  onPressActivity={(activityId) => console.log('Activity:', activityId)}
                  onPressMonth={(monthIndex) => handlePressMonth(plant.id, monthIndex)}
                  onPressPlant={() => console.log('Plant:', plant.name)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </ScrollView>

      {plants.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            {plants.length} Pflanze{plants.length !== 1 ? 'n' : ''}
          </Text>
        </View>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
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
  footerText: {
    fontSize: 12,
  },
});
