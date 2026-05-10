import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { PlantProvider, usePlants } from '../../src/contexts/PlantContext';

const mockGetItem = jest.fn().mockResolvedValue(null);
const mockSetItem = jest.fn().mockResolvedValue(undefined);

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args: any[]) => mockGetItem(...args),
  setItem: (...args: any[]) => mockSetItem(...args),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PlantProvider>{children}</PlantProvider>
);

const waitForLoaded = async (result: any) => {
  await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
};

describe('PlantContext – initial load', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    expect(result.current.loading).toBe(true);
  });

  it('finishes loading and provides plants array', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);
    expect(Array.isArray(result.current.plants)).toBe(true);
  });

  it('loads default plants when storage is empty', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);
    expect(result.current.plants.length).toBeGreaterThan(0);
  });

  it('loads saved plants from storage', async () => {
    const savedPlants = [
      {
        id: 'saved-1',
        name: 'Gespeicherte Pflanze',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    mockGetItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(JSON.stringify(savedPlants))
        : Promise.resolve(null)
    );

    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    expect(result.current.plants.some((p) => p.name === 'Gespeicherte Pflanze')).toBe(true);
  });

  it('handles STORAGE_CORRUPTED by showing empty state', async () => {
    // All entries fail validation → STORAGE_CORRUPTED thrown
    const corruptedData = JSON.stringify([{ invalid: true }]);
    mockGetItem.mockResolvedValueOnce(corruptedData);

    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    expect(result.current.plants).toEqual([]);
  });
});

describe('PlantContext – addPlant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('adds a new plant to the list', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    const before = result.current.plants.length;

    act(() => {
      result.current.addPlant({
        name: 'Neue Pflanze',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    // addPlant calls the async savePlants internally; use waitFor so the
    // assertion is tied to the actual state update, not an arbitrary flush.
    await waitFor(() => {
      expect(result.current.plants.length).toBe(before + 1);
    });
  });

  it('persists the added plant via AsyncStorage', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    await act(async () => {
      result.current.addPlant({
        name: 'Persistenz-Test',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    expect(mockSetItem).toHaveBeenCalled();
  });

  it('assigns a non-empty string id to the new plant', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    await act(async () => {
      result.current.addPlant({
        name: 'IdTestPlant',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    const added = result.current.plants.find((p) => p.name === 'IdTestPlant');
    expect(added).toBeTruthy();
    expect(typeof added!.id).toBe('string');
    expect(added!.id.length).toBeGreaterThan(0);
  });
});

describe('PlantContext – updatePlant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('updates an existing plant', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    let plantId: string;
    await act(async () => {
      result.current.addPlant({
        name: 'Original',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });
    plantId = result.current.plants.find((p) => p.name === 'Original')!.id;

    await act(async () => {
      result.current.updatePlant(plantId, { name: 'Geändert' });
    });

    const updated = result.current.plants.find((p) => p.id === plantId);
    expect(updated?.name).toBe('Geändert');
  });
});

describe('PlantContext – deletePlant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('removes a plant from the list', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    await act(async () => {
      result.current.addPlant({
        name: 'ToDelete',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    const plant = result.current.plants.find((p) => p.name === 'ToDelete')!;
    const before = result.current.plants.length;

    await act(async () => {
      result.current.deletePlant(plant.id);
    });

    expect(result.current.plants.length).toBe(before - 1);
    expect(result.current.plants.find((p) => p.id === plant.id)).toBeUndefined();
  });
});

describe('PlantContext – addActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('adds an activity to a plant', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    await act(async () => {
      result.current.addPlant({
        name: 'PflanzeMitActivity',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    const plant = result.current.plants.find((p) => p.name === 'PflanzeMitActivity')!;

    await act(async () => {
      result.current.addActivity(plant.id, {
        type: 'sow',
        startMonth: 2,
        endMonth: 4,
        color: '#4CAF50',
        label: 'Aussaat',
      });
    });

    const updated = result.current.plants.find((p) => p.id === plant.id)!;
    expect(updated.activities.length).toBe(1);
    expect(updated.activities[0].label).toBe('Aussaat');
  });
});

describe('PlantContext – updateActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('updates an activity on a plant', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    await act(async () => {
      result.current.addPlant({
        name: 'PlantForUpdate',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    const plant = result.current.plants.find((p) => p.name === 'PlantForUpdate')!;

    await act(async () => {
      result.current.addActivity(plant.id, {
        type: 'sow',
        startMonth: 0,
        endMonth: 2,
        color: '#4CAF50',
        label: 'Original Label',
      });
    });

    const withActivity = result.current.plants.find((p) => p.id === plant.id)!;
    const activityId = withActivity.activities[0].id;

    await act(async () => {
      result.current.updateActivity(plant.id, activityId, { label: 'Neues Label' });
    });

    const updated = result.current.plants.find((p) => p.id === plant.id)!;
    expect(updated.activities[0].label).toBe('Neues Label');
  });
});

describe('PlantContext – deleteActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('removes an activity from a plant', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    await act(async () => {
      result.current.addPlant({
        name: 'PlantForDelete',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    const plant = result.current.plants.find((p) => p.name === 'PlantForDelete')!;

    await act(async () => {
      result.current.addActivity(plant.id, {
        type: 'harvest',
        startMonth: 8,
        endMonth: 10,
        color: '#FF5722',
        label: 'Ernte',
      });
    });

    const withActivity = result.current.plants.find((p) => p.id === plant.id)!;
    const activityId = withActivity.activities[0].id;

    await act(async () => {
      result.current.deleteActivity(plant.id, activityId);
    });

    const updated = result.current.plants.find((p) => p.id === plant.id)!;
    expect(updated.activities.length).toBe(0);
  });
});

describe('PlantContext – resetToDefaults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('resets plants to defaults', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });
    await waitForLoaded(result);

    // Add a custom plant
    await act(async () => {
      result.current.addPlant({
        name: 'CustomPlant',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
      });
    });

    // Reset to defaults
    await act(async () => {
      await result.current.resetToDefaults();
    });

    // Custom plant should be gone
    expect(result.current.plants.find((p) => p.name === 'CustomPlant')).toBeUndefined();
    // Default plants should be back
    expect(result.current.plants.length).toBeGreaterThan(0);
  });
});

describe('PlantContext – usePlants hook', () => {
  it('throws when used outside PlantProvider', () => {
    // Suppress console.error for this expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => usePlants())).toThrow(
      'usePlants must be used within a PlantProvider'
    );
    spy.mockRestore();
  });
});
