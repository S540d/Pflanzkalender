import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AddPlantModal } from '../components/AddPlantModal';
import { EditPlantModal } from '../components/EditPlantModal';
import { Plant, PlantLocation, PlantCategory } from '../types';
import { PLANT_LOCATION_METADATA, PLANT_CATEGORY_METADATA } from '../constants/plantMetadata';
import { getPlantDisplayName } from '../constants/plantNames';
import { getPlantEmoji } from '../constants/plantEmojis';
import { CATEGORY_TABS, CategoryFilter } from '../constants/categoryTabs';

export const PlantManagementScreen: React.FC = () => {
  const { theme } = useTheme();
  const { plants, addPlant, updatePlant, deletePlant } = usePlants();
  const { t, language } = useLanguage();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  // Metadata objects only have 'de' and 'en' — all other languages fall back to 'en'
  const metaLang: 'de' | 'en' = language === 'de' ? 'de' : 'en';

  // Reset filters when navigating away from this screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery('');
        setActiveCategory('all');
      };
    }, [])
  );

  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) =>
      getPlantDisplayName(a.name, language).localeCompare(getPlantDisplayName(b.name, language))
    );
  }, [plants, language]);

  const filteredPlants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q && activeCategory === 'all') return sortedPlants;
    return sortedPlants.filter((plant) => {
      if (activeCategory !== 'all' && (plant.category ?? 'vegetable') !== activeCategory) {
        return false;
      }
      if (q) {
        const display = getPlantDisplayName(plant.name, language).toLowerCase();
        if (!display.includes(q) && !plant.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [sortedPlants, searchQuery, activeCategory, language]);

  const handleAddPlant = (
    name: string,
    notes: string,
    location?: PlantLocation,
    category?: PlantCategory
  ) => {
    addPlant({ name, notes, location, category, isDefault: false, userId: null, activities: [] });
    setShowAddPlant(false);
  };

  const handleEditPlant = (
    id: string,
    updates: Pick<Plant, 'name' | 'notes' | 'location' | 'category'>
  ) => {
    updatePlant(id, updates);
    setEditingPlant(null);
  };

  const handleDeletePlant = (plantId: string, plantName: string) => {
    const message = `"${plantName}" ${t('plants.deleteMessage') as string}`;
    Alert.alert(t('plants.deleteTitle') as string, message, [
      { text: t('plants.deleteCancel') as string, style: 'cancel' },
      {
        text: t('plants.deleteConfirm') as string,
        style: 'destructive',
        onPress: () => deletePlant(plantId),
      },
    ]);
  };

  const isFiltered = searchQuery.trim().length > 0 || activeCategory !== 'all';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{t('plants.title') as string}</Text>

          <TextInput
            style={[
              styles.searchInput,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
            ]}
            placeholder={t('plants.search') as string}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Kategorie-Filter */}
          <View
            style={[
              styles.categoryBar,
              { borderColor: theme.border, backgroundColor: theme.surface },
            ]}
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.value;
              const label = language === 'de' ? tab.labelDe : tab.labelEn;
              return (
                <TouchableOpacity
                  key={tab.value}
                  style={styles.categoryTab}
                  onPress={() => setActiveCategory(tab.value)}
                >
                  <View
                    style={[
                      styles.categoryIconBadge,
                      { backgroundColor: isActive ? tab.color : tab.color + '30' },
                    ]}
                  >
                    <Text style={styles.categoryTabIcon}>{tab.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryTabLabel,
                      {
                        color: isActive ? tab.color : theme.textSecondary,
                        fontWeight: isActive ? '700' : '400',
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddPlant(true)}
          >
            <Text style={styles.addButtonText}>{t('plants.add') as string}</Text>
          </TouchableOpacity>

          <View style={styles.plantList}>
            {filteredPlants.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {!isFiltered && sortedPlants.length === 0
                  ? (t('plants.empty') as string)
                  : (t('plants.noResults') as string)}
              </Text>
            ) : (
              filteredPlants.map((plant) => (
                <View
                  key={plant.id}
                  style={[
                    styles.plantItem,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.plantInfo}>
                    <View style={styles.plantNameRow}>
                      <Text style={styles.plantEmoji}>
                        {getPlantEmoji(plant.name, plant.category)}
                      </Text>
                      <Text style={[styles.plantName, { color: theme.text }]}>
                        {getPlantDisplayName(plant.name, language)}
                      </Text>
                    </View>
                    <View style={styles.plantMeta}>
                      {plant.category && (
                        <Text style={[styles.plantMetaText, { color: theme.textSecondary }]}>
                          {PLANT_CATEGORY_METADATA[plant.category].icon}{' '}
                          {PLANT_CATEGORY_METADATA[plant.category][metaLang]}
                        </Text>
                      )}
                      {plant.location && (
                        <Text style={[styles.plantMetaText, { color: theme.textSecondary }]}>
                          {PLANT_LOCATION_METADATA[plant.location].icon}{' '}
                          {PLANT_LOCATION_METADATA[plant.location][metaLang]}
                        </Text>
                      )}
                    </View>
                    {plant.notes && (
                      <Text style={[styles.plantNotes, { color: theme.textSecondary }]}>
                        {plant.notes}
                      </Text>
                    )}
                    <Text style={[styles.activityCount, { color: theme.textSecondary }]}>
                      {plant.activities.length} {t('plants.activities') as string}
                    </Text>
                  </View>
                  <View style={styles.plantActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                      ]}
                      onPress={() => setEditingPlant(plant)}
                      accessibilityLabel={`${t('plants.editTitle') as string}: ${getPlantDisplayName(plant.name, language)}`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#ff4444', borderColor: '#ff4444' },
                      ]}
                      onPress={() => handleDeletePlant(plant.id, plant.name)}
                      accessibilityLabel={`${t('plants.deleteTitle') as string}: ${getPlantDisplayName(plant.name, language)}`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
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
      {editingPlant && (
        <EditPlantModal
          visible={true}
          plant={editingPlant}
          onClose={() => setEditingPlant(null)}
          onSave={handleEditPlant}
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
  searchInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 12,
  },
  categoryBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  categoryIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTabIcon: {
    fontSize: 16,
  },
  categoryTabLabel: {
    fontSize: 9,
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
  plantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    flexShrink: 1,
  },
  plantEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  plantMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  plantMetaText: {
    fontSize: 13,
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
  plantActions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
});
