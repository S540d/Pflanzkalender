import React from 'react';
import { render, waitFor, within } from '@testing-library/react-native';
import { AgendaScreen } from '../../src/screens/AgendaScreen';
import { PlantProvider } from '../../src/contexts/PlantContext';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { GardenOffsetProvider } from '../../src/contexts/GardenOffsetContext';

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

// Aktivität nur im Halbmonat 10 (Juni, 1. Hälfte); gespeichert bleibt sie dort.
const storedPlants = [
  {
    id: 'op1',
    name: 'Offsetpflanze',
    isDefault: false,
    userId: null,
    activities: [
      {
        id: 'oa1',
        type: 'sow',
        startMonth: 10,
        endMonth: 10,
        color: '#4CAF50',
        label: 'Offsetaktion',
        isCustomized: true,
      },
    ],
    notes: '',
    createdAt: 1,
    updatedAt: 1,
  },
];

let mockStoredOffset: string | null = null;

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockImplementation((key: string) => {
    if (key === '@Pflanzkalender:plants') return Promise.resolve(JSON.stringify(storedPlants));
    if (key === '@Pflanzkalender:gardenOffset') return Promise.resolve(mockStoredOffset);
    return Promise.resolve(null);
  }),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>
      <GardenOffsetProvider>{children}</GardenOffsetProvider>
    </PlantProvider>
  </LanguageProvider>
);

describe('Garten-Zeitversatz – Agenda', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true, now: new Date(2026, 5, 10) }); // Halbmonat 10
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Agenda: ohne Versatz in „Aktuell", mit +1 in „Demnächst"', async () => {
    mockStoredOffset = null;
    const plain = await render(<AgendaScreen />, { wrapper: Wrapper });
    const current = await plain.findByTestId('agenda-column-0');
    await within(current).findByText('Offsetaktion');
    expect(within(plain.getByTestId('agenda-column-1')).queryByText('Offsetaktion')).toBeNull();
    plain.unmount();

    mockStoredOffset = '1';
    const shifted = await render(<AgendaScreen />, { wrapper: Wrapper });
    await waitFor(() =>
      expect(
        within(shifted.getByTestId('agenda-column-1')).queryByText('Offsetaktion')
      ).toBeTruthy()
    );
    expect(within(shifted.getByTestId('agenda-column-0')).queryByText('Offsetaktion')).toBeNull();
  });
});
