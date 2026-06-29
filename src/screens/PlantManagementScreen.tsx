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
import { CategoryFilter } from '../constants/categoryTabs';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { Button, Card, Icon } from '../components/ui';
import { radius, spacing } from '../constants/designTokens';

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
          <View style={styles.categoryBarWrap}>
            <CategoryTabBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          </View>

          <Button
            label={t('plants.add') as string}
            icon="add"
            size="lg"
            fullWidth
            onPress={() => setShowAddPlant(true)}
            style={styles.addButton}
          />

          <View style={styles.plantList}>
            {filteredPlants.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {!isFiltered && sortedPlants.length === 0
                  ? (t('plants.empty') as string)
                  : (t('plants.noResults') as string)}
              </Text>
            ) : (
              filteredPlants.map((plant) => (
                <Card key={plant.id} elevation={1} padding={spacing.lg} style={styles.plantItem}>
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
                      <Icon name="edit" size={18} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.error, borderColor: theme.error },
                      ]}
                      onPress={() => handleDeletePlant(plant.id, plant.name)}
                      accessibilityLabel={`${t('plants.deleteTitle') as string}: ${getPlantDisplayName(plant.name, language)}`}
                      accessibilityRole="button"
                    >
                      <Icon name="delete" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </Card>
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
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 12,
  },
  categoryBarWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  addButton: {
    marginBottom: spacing.xxl,
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
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
