import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AddPlantModal } from '../components/AddPlantModal';
import { PlantLocation } from '../types';

const LOCATION_LABELS: Record<PlantLocation, { de: string; en: string; icon: string }> = {
  sun: { de: 'Sonne', en: 'Sun', icon: '☀️' },
  'partial-shade': { de: 'Halbschatten', en: 'Partial Shade', icon: '⛅' },
  shade: { de: 'Schatten', en: 'Shade', icon: '🌥️' },
};

export const PlantManagementScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants, addPlant, deletePlant } = usePlants();
  const { t, language } = useLanguage();
  const [showAddPlant, setShowAddPlant] = useState(false);

  // Sortiere Pflanzen alphabetisch
  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }, [plants]);

  const handleAddPlant = (name: string, notes: string, location?: PlantLocation) => {
    addPlant({ name, notes, location, isDefault: false, userId: null, activities: [] });
    setShowAddPlant(false);
  };

  const handleDeletePlant = (plantId: string, plantName: string) => {
    const message = language === 'de'
      ? `Möchtest du "${plantName}" wirklich löschen?`
      : `Do you really want to delete "${plantName}"?`;

    if (confirm(message)) {
      deletePlant(plantId);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            {language === 'de' ? 'Pflanzen verwalten' : 'Manage Plants'}
          </Text>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddPlant(true)}
          >
            <Text style={styles.addButtonText}>
              {language === 'de' ? '➕ Neue Pflanze hinzufügen' : '➕ Add New Plant'}
            </Text>
          </TouchableOpacity>

          <View style={styles.plantList}>
            {sortedPlants.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {language === 'de' ? 'Noch keine Pflanzen vorhanden' : 'No plants yet'}
              </Text>
            ) : (
              sortedPlants.map((plant) => (
                <View
                  key={plant.id}
                  style={[styles.plantItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.plantInfo}>
                    <Text style={[styles.plantName, { color: theme.text }]}>{plant.name}</Text>
                    {plant.location && (
                      <Text style={[styles.plantLocation, { color: theme.textSecondary }]}>
                        {LOCATION_LABELS[plant.location].icon} {LOCATION_LABELS[plant.location][language]}
                      </Text>
                    )}
                    {plant.notes && (
                      <Text style={[styles.plantNotes, { color: theme.textSecondary }]}>
                        {plant.notes}
                      </Text>
                    )}
                    <Text style={[styles.activityCount, { color: theme.textSecondary }]}>
                      {plant.activities.length} {language === 'de' ? 'Aktivitäten' : 'Activities'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: '#ff4444' }]}
                    onPress={() => handleDeletePlant(plant.id, plant.name)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {showAddPlant && (
        <AddPlantModal
          visible={showAddPlant}
          onClose={() => setShowAddPlant(false)}
          onAdd={handleAddPlant}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  plantList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  plantLocation: {
    fontSize: 13,
    marginBottom: 4,
  },
  plantNotes: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityCount: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 20,
  },
});
