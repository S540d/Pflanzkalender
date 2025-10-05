import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant, Activity } from '../types';
import { storageService } from '../services/storage';
import { DEFAULT_PLANTS } from '../constants/defaultPlants';

interface PlantContextType {
  plants: Plant[];
  loading: boolean;
  addPlant: (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  addActivity: (plantId: string, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (plantId: string, activityId: string, updates: Partial<Activity>) => void;
  deleteActivity: (plantId: string, activityId: string) => void;
  resetToDefaults: () => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};

interface PlantProviderProps {
  children: ReactNode;
}

export const PlantProvider: React.FC<PlantProviderProps> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialisierung: Lade Pflanzen oder setze Standardpflanzen
  useEffect(() => {
    const initializePlants = async () => {
      try {
        const savedPlants = await storageService.loadPlants();

        if (savedPlants.length === 0) {
          // Erste Nutzung: Standardpflanzen laden
          const defaultPlants: Plant[] = DEFAULT_PLANTS.map((p, index) => ({
            ...p,
            id: `default-${index}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }));
          setPlants(defaultPlants);
          await storageService.savePlants(defaultPlants);
        } else {
          setPlants(savedPlants);
        }
      } catch (error) {
        console.error('Error initializing plants:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePlants();
  }, []);

  // Speichere Pflanzen bei jeder Änderung
  const savePlants = async (newPlants: Plant[]) => {
    try {
      await storageService.savePlants(newPlants);
      setPlants(newPlants);
    } catch (error) {
      console.error('Error saving plants:', error);
    }
  };

  const addPlant = (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlant: Plant = {
      ...plant,
      id: `plant-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    savePlants([...plants, newPlant]);
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    const updatedPlants = plants.map(plant =>
      plant.id === id
        ? { ...plant, ...updates, updatedAt: Date.now() }
        : plant
    );
    savePlants(updatedPlants);
  };

  const deletePlant = (id: string) => {
    const filteredPlants = plants.filter(plant => plant.id !== id);
    savePlants(filteredPlants);
  };

  const addActivity = (plantId: string, activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
    };

    const updatedPlants = plants.map(plant =>
      plant.id === plantId
        ? {
            ...plant,
            activities: [...plant.activities, newActivity],
            updatedAt: Date.now(),
          }
        : plant
    );
    savePlants(updatedPlants);
  };

  const updateActivity = (plantId: string, activityId: string, updates: Partial<Activity>) => {
    const updatedPlants = plants.map(plant =>
      plant.id === plantId
        ? {
            ...plant,
            activities: plant.activities.map(act =>
              act.id === activityId ? { ...act, ...updates } : act
            ),
            updatedAt: Date.now(),
          }
        : plant
    );
    savePlants(updatedPlants);
  };

  const deleteActivity = (plantId: string, activityId: string) => {
    const updatedPlants = plants.map(plant =>
      plant.id === plantId
        ? {
            ...plant,
            activities: plant.activities.filter(act => act.id !== activityId),
            updatedAt: Date.now(),
          }
        : plant
    );
    savePlants(updatedPlants);
  };

  const resetToDefaults = async () => {
    const defaultPlants: Plant[] = DEFAULT_PLANTS.map((p, index) => ({
      ...p,
      id: `default-${index}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
    await savePlants(defaultPlants);
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        loading,
        addPlant,
        updatePlant,
        deletePlant,
        addActivity,
        updateActivity,
        deleteActivity,
        resetToDefaults,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};
