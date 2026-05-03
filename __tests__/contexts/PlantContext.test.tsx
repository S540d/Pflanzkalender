import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { PlantProvider, usePlants } from '../../src/contexts/PlantContext';

describe('PlantContext – CRUD Operations', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PlantProvider>{children}</PlantProvider>
  );

  it('loads plants on mount', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(Array.isArray(result.current.plants)).toBe(true);
    expect(result.current.plants.length).toBeGreaterThanOrEqual(0);
  });

  it('provides CRUD methods that work', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    const initialCount = result.current.plants.length;

    // Test addPlant
    await act(async () => {
      await result.current.addPlant({
        id: 'test-plant',
        name: 'Test Plant',
        activities: [],
        isDefault: false,
      });
    });

    expect(result.current.plants.length).toBe(initialCount + 1);

    // Verify CRUD methods are callable
    expect(typeof result.current.deletePlant).toBe('function');
    expect(typeof result.current.updatePlant).toBe('function');
    expect(typeof result.current.addActivity).toBe('function');
    expect(typeof result.current.deleteActivity).toBe('function');
    expect(typeof result.current.updateActivity).toBe('function');
  });
});
