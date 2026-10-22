import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { PlantProvider } from '../../src/contexts/PlantContext';
import { GardenOffsetProvider } from '../../src/contexts/GardenOffsetContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

const renderHeader = (props: React.ComponentProps<typeof ScreenHeader>) =>
  render(
    <LanguageProvider>
      <PlantProvider>
        <GardenOffsetProvider>
          <ScreenHeader {...props} />
        </GardenOffsetProvider>
      </PlantProvider>
    </LanguageProvider>
  );

describe('ScreenHeader', () => {
  it('zeigt Titel und Untertitel', async () => {
    const { getByText } = await renderHeader({ title: 'Agenda', subtitle: 'Diese Woche' });
    expect(getByText('Agenda')).toBeTruthy();
    expect(getByText('Diese Woche')).toBeTruthy();
  });

  it('öffnet die Einstellungen über das ⋮-Menü', async () => {
    const { getByTestId, queryByTestId } = await renderHeader({ title: 'Kalender', large: true });
    expect(queryByTestId('garden-offset-1')).toBeNull();
    await fireEvent.press(getByTestId('header-settings-button'));
    expect(getByTestId('garden-offset-1')).toBeTruthy();
  });
});
