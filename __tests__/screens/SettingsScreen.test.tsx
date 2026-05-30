import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SettingsScreen } from '../../src/screens/SettingsScreen';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { PlantProvider } from '../../src/contexts/PlantContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockSetThemeMode = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
    back: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ddd',
      surface: '#f5f5f5',
      primary: '#4CAF50',
      error: '#f44336',
    },
    themeMode: 'system',
    setThemeMode: mockSetThemeMode,
  }),
}));

jest.mock('../../src/services/storage', () => ({
  storageService: {
    exportPlants: jest.fn().mockResolvedValue(undefined),
    loadPlants: jest.fn().mockResolvedValue([]),
    importPlants: jest.fn(),
  },
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@react-native-async-storage/async-storage');

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <LanguageProvider>
      <PlantProvider>{ui}</PlantProvider>
    </LanguageProvider>
  );

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders without crashing', () => {
    const { root } = renderWithProviders(<SettingsScreen />);
    expect(root).toBeTruthy();
  });

  it('renders the Settings title', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/Settings|Einstellungen/)).toBeTruthy();
  });

  it('renders appearance section', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/APPEARANCE|ERSCHEINUNGSBILD/)).toBeTruthy();
  });

  it('renders Dark and System theme buttons', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/Dark|Dunkel/)).toBeTruthy();
    expect(getByText(/System/)).toBeTruthy();
  });

  it('calls setThemeMode("dark") when Dark button is pressed', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    fireEvent.press(getByText(/^Dark$|^Dunkel$/));
    expect(mockSetThemeMode).toHaveBeenCalledWith('dark');
  });

  it('calls setThemeMode("system") when System button is pressed', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    fireEvent.press(getByText(/^System$/));
    expect(mockSetThemeMode).toHaveBeenCalledWith('system');
  });

  it('renders language section', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/LANGUAGE|SPRACHE/)).toBeTruthy();
  });

  it('renders English and German language buttons', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText('English')).toBeTruthy();
    expect(getByText(/German|Deutsch/)).toBeTruthy();
  });

  it('switches to English when English button is pressed', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    fireEvent.press(getByText('English'));
    expect(getByText('Settings')).toBeTruthy();
  });

  it('switches back to German when Deutsch button is pressed', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    // First switch to English
    fireEvent.press(getByText('English'));
    // Then switch back to German
    fireEvent.press(getByText('Deutsch'));
    expect(getByText('Einstellungen')).toBeTruthy();
  });

  it('renders the export section', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/EXPORT|EXPORTIEREN/)).toBeTruthy();
  });

  it('renders the export data button', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/Export as JSON|Als JSON exportieren/)).toBeTruthy();
  });

  it('calls storageService.exportPlants when export button is pressed', async () => {
    const { storageService } = require('../../src/services/storage');
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = renderWithProviders(<SettingsScreen />);
    fireEvent.press(getByText(/Export as JSON|Als JSON exportieren/));

    await waitFor(() => {
      expect(storageService.exportPlants).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it('renders the version number', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/\d+\.\d+\.\d+/)).toBeTruthy();
  });

  it('renders About section', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/ABOUT|ÜBER/)).toBeTruthy();
  });

  it('renders feedback and Ko-fi links', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/Feedback|feedback/i)).toBeTruthy();
    expect(getByText('Ko-fi')).toBeTruthy();
  });

  it('navigates to "/" (not "/(tabs)") when Schließen/Close is pressed', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    fireEvent.press(getByText(/Schließen|Close/));
    expect(mockRouterReplace).toHaveBeenCalledWith('/');
    expect(mockRouterReplace).not.toHaveBeenCalledWith('/(tabs)');
  });

  it('is a valid React component', () => {
    expect(typeof SettingsScreen).toBe('function');
  });

  it('renders the import section', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/IMPORTIEREN|IMPORT/)).toBeTruthy();
  });

  it('renders the import button', () => {
    const { getByText } = renderWithProviders(<SettingsScreen />);
    expect(getByText(/Aus JSON importieren|Import from JSON/)).toBeTruthy();
  });

  it('shows a native-only alert when import button is pressed on non-web platform', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = renderWithProviders(<SettingsScreen />);
    fireEvent.press(getByText(/Aus JSON importieren|Import from JSON/));
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Aus JSON importieren|Import from JSON/),
        expect.stringMatching(/Browser|browser/)
      );
    });
  });
});
