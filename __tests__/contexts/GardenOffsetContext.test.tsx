import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { GardenOffsetProvider, useGardenOffset } from '../../src/contexts/GardenOffsetContext';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (key: string) => mockGetItem(key),
  setItem: (key: string, value: string) => mockSetItem(key, value),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GardenOffsetProvider>{children}</GardenOffsetProvider>
);

describe('GardenOffsetContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('startet ohne Versatz', async () => {
    const { result } = await renderHook(() => useGardenOffset(), { wrapper });
    expect(result.current.offset).toBe(0);
  });

  it('lädt den gespeicherten Wert (begrenzt)', async () => {
    mockGetItem.mockResolvedValue('1');
    const { result } = await renderHook(() => useGardenOffset(), { wrapper });
    await waitFor(() => expect(result.current.offset).toBe(1));
  });

  it('begrenzt unplausible gespeicherte Werte und ignoriert Müll', async () => {
    mockGetItem.mockResolvedValue('99');
    const big = await renderHook(() => useGardenOffset(), { wrapper });
    await waitFor(() => expect(big.result.current.offset).toBe(2));

    mockGetItem.mockResolvedValue('abc');
    const junk = await renderHook(() => useGardenOffset(), { wrapper });
    await waitFor(() => expect(mockGetItem).toHaveBeenCalledTimes(2));
    expect(junk.result.current.offset).toBe(0);
  });

  it('speichert Änderungen und begrenzt sie', async () => {
    const { result } = await renderHook(() => useGardenOffset(), { wrapper });
    await act(async () => {
      result.current.setOffset(-1);
    });
    expect(result.current.offset).toBe(-1);
    expect(mockSetItem).toHaveBeenCalledWith('@Pflanzkalender:gardenOffset', '-1');

    await act(async () => {
      result.current.setOffset(10);
    });
    expect(result.current.offset).toBe(2);
    expect(mockSetItem).toHaveBeenLastCalledWith('@Pflanzkalender:gardenOffset', '2');
  });

  it('liefert ohne Provider „kein Versatz" statt zu werfen', async () => {
    const { result } = await renderHook(() => useGardenOffset());
    expect(result.current.offset).toBe(0);
  });
});
