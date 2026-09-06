import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant } from '../types';
import { PlantSchema, parseImportData } from '../schemas/plant';
import { withStorageError, withStorageErrorFallback } from '../utils/storageError';

const STORAGE_KEYS = {
  PLANTS: '@Pflanzkalender:plants',
  IS_GUEST: '@Pflanzkalender:isGuest',
};

export const storageService = {
  // Pflanzen speichern
  async savePlants(plants: Plant[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
    } catch (error) {
      console.error('Error saving plants:', error);
      throw error;
    }
  },

  // Pflanzen laden
  async loadPlants(): Promise<Plant[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PLANTS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      const valid: Plant[] = [];
      for (const item of parsed) {
        const result = PlantSchema.safeParse(item);
        if (result.success) {
          valid.push(result.data);
        } else {
          console.error(
            'Skipping corrupt plant entry:',
            result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')
          );
        }
      }
      if (valid.length === 0 && parsed.length > 0) {
        // All entries failed validation – signal corruption so callers don't silently overwrite with defaults
        throw new Error('STORAGE_CORRUPTED');
      }
      return valid;
    } catch (error) {
      if (error instanceof Error && error.message === 'STORAGE_CORRUPTED') {
        throw error;
      }
      console.error('Error loading plants:', error);
      return [];
    }
  },

  // Guest-Status speichern
  async setGuestMode(isGuest: boolean): Promise<void> {
    return withStorageError('Error setting guest mode:', () =>
      AsyncStorage.setItem(STORAGE_KEYS.IS_GUEST, JSON.stringify(isGuest))
    );
  },

  // Guest-Status laden
  async isGuestMode(): Promise<boolean> {
    return withStorageErrorFallback(
      'Error checking guest mode:',
      async () => {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.IS_GUEST);
        return data ? JSON.parse(data) : true; // Default: Guest mode
      },
      true
    );
  },

  // Alle Daten löschen
  async clearAll(): Promise<void> {
    return withStorageError('Error clearing storage:', async () => {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PLANTS),
        AsyncStorage.removeItem(STORAGE_KEYS.IS_GUEST),
      ]);
    });
  },

  // Import plants from JSON (delegates validation to parseImportData)
  async importPlants(jsonString: string): Promise<Plant[]> {
    try {
      return parseImportData(jsonString);
    } catch (error) {
      console.error('Error importing plants:', error);
      throw error;
    }
  },
};
