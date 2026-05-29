import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../constants/theme';
import { withStorageError } from '../utils/storageError';

type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = (): {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
} => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Determine if dark theme should be active
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // Load theme preference on mount
  useEffect(() => {
    void withStorageError('Error loading theme preference:', async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        setThemeModeState(savedTheme as ThemeMode);
      }
    });
  }, []);

  // Save theme preference when it changes
  const setThemeMode = (mode: ThemeMode): void => {
    void withStorageError('Error saving theme preference:', async () => {
      await AsyncStorage.setItem('theme', mode);
      setThemeModeState(mode);
    });
  };

  return {
    theme: isDark ? darkTheme : lightTheme,
    isDark,
    themeMode,
    setThemeMode,
  };
};
