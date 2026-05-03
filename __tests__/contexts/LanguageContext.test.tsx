import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { LanguageProvider, useLanguage } from '../../src/contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('LanguageContext – Language Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  it('initializes with default language (de) after mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('de');

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('language');
    });
  });

  it('loads persisted language from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en');

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.language).toBe('en');
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('language');
  });

  it('changes language', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
  });

  it('persists language to AsyncStorage when changed', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.setLanguage('en');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('language', 'en');
  });

  it('translates keys correctly in German', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    const translated = result.current.t('calendar.title');
    expect(translated).toBe('Pflanzkalender');
  });

  it('translates keys correctly in English', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.setLanguage('en');
    });

    const translated = result.current.t('calendar.title');
    expect(translated).toBe('Plant Calendar');
  });

  it('returns key as fallback for unknown translation', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    const translated = result.current.t('unknown.key');
    expect(translated).toBe('unknown.key');
  });

  it('returns arrays for agenda.months', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    const months = result.current.t('agenda.months');
    expect(Array.isArray(months)).toBe(true);
    expect((months as string[]).length).toBe(24);
  });
});
