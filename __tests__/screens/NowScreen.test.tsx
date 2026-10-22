import React from 'react';
import { render, waitFor, fireEvent, within } from '@testing-library/react-native';
import { NowScreen } from '../../src/screens/NowScreen';
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
      onPrimary: '#fff',
      success: '#4CAF50',
      accent: '#E0A030',
      error: '#f44336',
      headerTitle: '#fff',
      headerSubtitle: '#ccc',
      gradientStart: '#1F3D2B',
    },
    isDark: false,
    themeMode: 'light',
    setThemeMode: jest.fn(),
  }),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useFocusEffect: jest.fn(),
}));

const activity = (id: string, start: number, end: number, label: string, extra = {}) => ({
  id,
  type: 'sow',
  startMonth: start,
  endMonth: end,
  color: '#4CAF50',
  label,
  isCustomized: true,
  ...extra,
});

// „Jetzt" = Juni, 1. Hälfte (Halbmonat 10), Datum fest gesetzt.
let mockPlants: unknown[] = [];

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest
    .fn()
    .mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(JSON.stringify(mockPlants))
        : Promise.resolve(null)
    ),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

const plant = (id: string, name: string, activities: unknown[]) => ({
  id,
  name,
  isDefault: false,
  userId: null,
  category: 'vegetable',
  activities,
  notes: '',
  createdAt: 1,
  updatedAt: 1,
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>
      <GardenOffsetProvider>{children}</GardenOffsetProvider>
    </PlantProvider>
  </LanguageProvider>
);

describe('NowScreen – Jetzt im Garten', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true, now: new Date(2026, 5, 10) });
    mockPush.mockClear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('zeigt Aufgaben des laufenden Halbmonats unter „Zu erledigen" und zählt sie im Kopf', async () => {
    mockPlants = [
      plant('p1', 'Tomate', [activity('a1', 10, 10, 'Jetzt-Aufgabe')]),
      plant('p2', 'Gurke', [activity('a2', 4, 4, 'Anderer-Monat')]),
    ];
    const { findByText, queryByText, getByText } = await render(<NowScreen />, {
      wrapper: Wrapper,
    });

    expect(await findByText('Jetzt-Aufgabe')).toBeTruthy();
    expect(queryByText('Anderer-Monat')).toBeNull();
    expect(getByText('Zu erledigen')).toBeTruthy();
    expect(getByText(/1 Aufgabe offen/)).toBeTruthy();
  });

  it('schiebt eine abgehakte Aufgabe nach „Erledigt" und zeigt dann „Alles erledigt"', async () => {
    mockPlants = [plant('p1', 'Tomate', [activity('a1', 10, 10, 'Jetzt-Aufgabe')])];
    const { findByTestId, findByText, getAllByText, queryByText } = await render(<NowScreen />, {
      wrapper: Wrapper,
    });

    await fireEvent.press(await findByTestId('agenda-check-p1-a1-2026'));

    await waitFor(() => expect(queryByText('Zu erledigen')).toBeNull());
    expect(await findByText('Erledigt')).toBeTruthy();
    expect(getAllByText('Alles erledigt').length).toBeGreaterThanOrEqual(1);
  });

  it('zeigt „Gartenruhe", wenn im Halbmonat nichts ansteht', async () => {
    mockPlants = [plant('p1', 'Tomate', [activity('a1', 20, 20, 'Spaeter')])];
    const { findByText } = await render(<NowScreen />, { wrapper: Wrapper });
    expect(await findByText('Gerade ist Gartenruhe')).toBeTruthy();
  });

  it('zeigt eine Vorschau auf den nächsten Halbmonat, begrenzt auf 5 Zeilen', async () => {
    mockPlants = Array.from({ length: 7 }, (_, i) =>
      plant(`p${i}`, `Pflanze${i}`, [activity(`a${i}`, 11, 11, `Naechste${i}`)])
    );
    const { findAllByTestId, getByText } = await render(<NowScreen />, { wrapper: Wrapper });

    const rows = await findAllByTestId('now-next-row');
    expect(rows).toHaveLength(5);
    expect(getByText('+ 2 weitere')).toBeTruthy();
    expect(within(rows[0]).getByText(/Naechste/)).toBeTruthy();
  });

  it('führt über den Link zur Agenda', async () => {
    mockPlants = [];
    const { findByTestId } = await render(<NowScreen />, { wrapper: Wrapper });
    await fireEvent.press(await findByTestId('now-all-upcoming'));
    expect(mockPush).toHaveBeenCalledWith('/agenda');
  });
});
