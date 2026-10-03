import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsModal } from '../../src/components/SettingsModal';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { PlantProvider } from '../../src/contexts/PlantContext';
import { GardenOffsetProvider } from '../../src/contexts/GardenOffsetContext';

const mockSetItem = jest.fn().mockResolvedValue(undefined);

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: (key: string, value: string) => mockSetItem(key, value),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ddd',
      surface: '#f5f5f5',
      surfaceElevated: '#fff',
      primary: '#4CAF50',
      error: '#f44336',
    },
    themeMode: 'light',
    setThemeMode: jest.fn(),
  }),
}));

describe('SettingsModal – Garten-Zeitversatz', () => {
  it('speichert die gewählte Verschiebung', async () => {
    const { getByTestId } = await render(
      <LanguageProvider>
        <PlantProvider>
          <GardenOffsetProvider>
            <SettingsModal visible onClose={jest.fn()} />
          </GardenOffsetProvider>
        </PlantProvider>
      </LanguageProvider>
    );

    await fireEvent.press(getByTestId('garden-offset-1'));
    expect(mockSetItem).toHaveBeenCalledWith('@Pflanzkalender:gardenOffset', '1');
    expect(getByTestId('garden-offset-1').props.accessibilityState).toMatchObject({
      selected: true,
    });
  });
});
