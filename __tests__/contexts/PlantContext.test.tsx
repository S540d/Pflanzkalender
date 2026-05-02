import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { PlantProvider, usePlants } from '../../src/contexts/PlantContext';

describe('PlantContext – CRUD Operations', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PlantProvider>{children}</PlantProvider>
  );

  it('loads plants on mount', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });

    expect(result.current.loading).toBe(true);

    // Wait for async load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(Array.isArray(result.current.plants)).toBe(true);
  });

  it('provides CRUD methods', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Verify all CRUD methods are defined
    expect(typeof result.current.addPlant).toBe('function');
    expect(typeof result.current.deletePlant).toBe('function');
    expect(typeof result.current.updatePlant).toBe('function');
    expect(typeof result.current.addActivity).toBe('function');
    expect(typeof result.current.deleteActivity).toBe('function');
    expect(typeof result.current.updateActivity).toBe('function');
  });
});
