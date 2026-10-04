import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TemplateScreen } from '../../src/screens/TemplateScreen';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { PlantProvider } from '../../src/contexts/PlantContext';
import { GardenOffsetProvider } from '../../src/contexts/GardenOffsetContext';

const mockShareIcs = jest.fn().mockResolvedValue(undefined);

jest.mock('../../src/services/templateService', () => ({
  sharePlants: jest.fn().mockResolvedValue(undefined),
  shareIcs: (...args: unknown[]) => mockShareIcs(...args),
  importFromJson: jest.fn(),
  buildShareString: jest.fn(() => '{}'),
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
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockImplementation((key: string) => {
    if (key === '@Pflanzkalender:plants')
      return Promise.resolve(
        JSON.stringify([
          {
            id: 'p1',
            name: 'Tomaten',
            isDefault: false,
            userId: null,
            activities: [
              { id: 'a1', type: 'sow', startMonth: 4, endMonth: 6, color: '#000', label: 'X' },
            ],
            notes: '',
            createdAt: 1,
            updatedAt: 1,
          },
        ])
      );
    if (key === '@Pflanzkalender:gardenOffset') return Promise.resolve('2');
    return Promise.resolve(null);
  }),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

describe('TemplateScreen – .ics-Export mit Garten-Zeitversatz', () => {
  it('übergibt die um den Versatz verschobenen Aktivitäten an shareIcs', async () => {
    const { getByText } = await render(
      <LanguageProvider>
        <PlantProvider>
          <GardenOffsetProvider>
            <TemplateScreen />
          </GardenOffsetProvider>
        </PlantProvider>
      </LanguageProvider>
    );

    await fireEvent.press(getByText(/^Exportieren$|^Export$/));
    // Plant + Offset werden asynchron geladen → Export erst auslösen, wenn der Button „1 Pflanze“ zeigt
    await waitFor(() => getByText(/📤 1 /));
    await fireEvent.press(getByText(/📅/));

    await waitFor(() => expect(mockShareIcs).toHaveBeenCalled());
    const [plants] = mockShareIcs.mock.calls[0];
    expect(plants[0].activities[0]).toMatchObject({ startMonth: 6, endMonth: 8 });
  });
});
