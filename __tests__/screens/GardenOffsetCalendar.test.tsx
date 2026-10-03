import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { CalendarScreen } from '../../src/screens/CalendarScreen';
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

let capturedPlants: { activities: { startMonth: number; endMonth: number }[] }[] = [];

jest.mock('../../src/components/PlantRowsContainer', () => ({
  PlantRowsContainer: (props: { sortedPlants: typeof capturedPlants }) => {
    capturedPlants = props.sortedPlants;
    return null;
  },
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>
      <GardenOffsetProvider>{children}</GardenOffsetProvider>
    </PlantProvider>
  </LanguageProvider>
);

describe('Garten-Zeitversatz – Kalender', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true, now: new Date(2026, 5, 10) }); // Halbmonat 10
    capturedPlants = [];
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Kalender: PlantRowsContainer bekommt verschobene Aktivitäten, Speicher bleibt unberührt', async () => {
    mockStoredOffset = '2';
    await render(<CalendarScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(capturedPlants[0]?.activities[0]).toMatchObject({ startMonth: 12, endMonth: 12 });
    });
    // Original in `storedPlants` unverändert
    expect(storedPlants[0].activities[0]).toMatchObject({ startMonth: 10, endMonth: 10 });
  });

  it('Kalender: zeigt Badge nur bei Versatz ≠ 0', async () => {
    mockStoredOffset = '-1';
    const { findByText } = await render(<CalendarScreen />, { wrapper: Wrapper });
    expect(await findByText(/Garten: 2 Wochen früher|Garden: 2 weeks earlier/)).toBeTruthy();
  });
});
