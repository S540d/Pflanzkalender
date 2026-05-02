import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant } from '../types';
import { Share } from 'react-native';
import { PlantSchema, ImportDataSchema } from '../schemas/plant';

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
          valid.push(result.data as Plant);
        } else {
          console.error('Skipping corrupt plant entry:', result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '));
        }
      }
      // Nur leeres Array zurückgeben wenn tatsächlich keine Daten gespeichert waren
      if (valid.length === 0 && parsed.length > 0) {
        console.error('All stored plants failed validation – returning raw data to prevent data loss');
        return parsed as Plant[];
      }
      return valid;
    } catch (error) {
      console.error('Error loading plants:', error);
      return [];
    }
  },

  // Guest-Status speichern
  async setGuestMode(isGuest: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_GUEST, JSON.stringify(isGuest));
    } catch (error) {
      console.error('Error setting guest mode:', error);
    }
  },

  // Guest-Status laden
  async isGuestMode(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.IS_GUEST);
      return data ? JSON.parse(data) : true; // Default: Guest mode
    } catch (error) {
      console.error('Error checking guest mode:', error);
      return true;
    }
  },

  // Alle Daten löschen
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.PLANTS, STORAGE_KEYS.IS_GUEST]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Export plants as JSON
  async exportPlants(): Promise<void> {
    try {
      const plants = await this.loadPlants();
      const exportData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        plants,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `Pflanzkalender_Export_${new Date().toISOString().split('T')[0]}.json`;

      // For React Native, use Share API
      try {
        await Share.share({
          message: jsonString,
          title: fileName,
          url: undefined,
        });
      } catch (shareError) {
        console.error('Error sharing file:', shareError);
        // Fallback: Copy to clipboard
        alert('Export data ready. Please copy the data manually.');
      }
    } catch (error) {
      console.error('Error exporting plants:', error);
      throw error;
    }
  },

  // Import plants from JSON
  async importPlants(jsonString: string): Promise<Plant[]> {
    try {
      const raw = JSON.parse(jsonString);
      const result = ImportDataSchema.safeParse(raw);
      if (!result.success) {
        const details = result.error.issues.map(i => `${i.path.join('.') || 'root'}: ${i.message}`).join('; ');
        throw new Error(`Invalid import format: ${details}`);
      }
      return result.data.plants as Plant[];
    } catch (error) {
      console.error('Error importing plants:', error);
      throw error;
    }
  },
};
