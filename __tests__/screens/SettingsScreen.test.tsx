import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SettingsScreen } from '../../src/screens/SettingsScreen';

const mockSetThemeMode = jest.fn();

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
  },
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn().mockResolvedValue(undefined),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { root } = render(<SettingsScreen />);
    expect(root).toBeTruthy();
  });

  it('renders the Settings title', () => {
    const { getByText } = render(<SettingsScreen />);
    // Default language is 'en' in SettingsScreen (internal state)
    expect(getByText(/Settings|Einstellungen/)).toBeTruthy();
  });

  it('renders appearance section', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/APPEARANCE|ERSCHEINUNGSBILD/)).toBeTruthy();
  });

  it('renders Dark and System theme buttons', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/Dark|Dunkel/)).toBeTruthy();
    expect(getByText(/System/)).toBeTruthy();
  });

  it('calls setThemeMode("dark") when Dark button is pressed', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText(/^Dark$|^Dunkel$/));
    expect(mockSetThemeMode).toHaveBeenCalledWith('dark');
  });

  it('calls setThemeMode("system") when System button is pressed', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText(/^System$/));
    expect(mockSetThemeMode).toHaveBeenCalledWith('system');
  });

  it('renders language section', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/LANGUAGE|SPRACHE/)).toBeTruthy();
  });

  it('renders English and German language buttons', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('English')).toBeTruthy();
    expect(getByText(/German|Deutsch/)).toBeTruthy();
  });

  it('switches to German when Deutsch button is pressed', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText(/German|Deutsch/));
    // After switching, settings title should be in German
    expect(getByText('Einstellungen')).toBeTruthy();
  });

  it('switches back to English when English button is pressed', () => {
    const { getByText } = render(<SettingsScreen />);
    // First switch to German
    fireEvent.press(getByText(/German|Deutsch/));
    // Then switch back
    fireEvent.press(getByText('English'));
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders the export section', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/EXPORT|EXPORTIEREN/)).toBeTruthy();
  });

  it('renders the export data button', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/Export as JSON|Als JSON exportieren/)).toBeTruthy();
  });

  it('calls storageService.exportPlants when export button is pressed', async () => {
    const { storageService } = require('../../src/services/storage');
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText(/Export as JSON|Als JSON exportieren/));

    await waitFor(() => {
      expect(storageService.exportPlants).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it('renders the version number', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/1\.3\.0/)).toBeTruthy();
  });

  it('renders About section', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/ABOUT|ÜBER/)).toBeTruthy();
  });

  it('renders feedback and Ko-fi links', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText(/Feedback|feedback/i)).toBeTruthy();
    expect(getByText('Ko-fi')).toBeTruthy();
  });

  it('is a valid React component', () => {
    expect(typeof SettingsScreen).toBe('function');
  });
});
