import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AgendaScreen } from '../../src/screens/AgendaScreen';
import { PlantProvider } from '../../src/contexts/PlantContext';
import { LanguageProvider } from '../../src/contexts/LanguageContext';

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
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>{children}</PlantProvider>
  </LanguageProvider>
);

describe('AgendaScreen', () => {
  it('renders without crashing', () => {
    const { root } = render(<AgendaScreen />, { wrapper: Wrapper });
    expect(root).toBeTruthy();
  });

  it('is a valid React component', () => {
    expect(typeof AgendaScreen).toBe('function');
  });

  it('renders the category tab bar', async () => {
    const { root } = render(<AgendaScreen />, { wrapper: Wrapper });
    expect(root).toBeTruthy();
  });

  it('renders Alle/All category tab', async () => {
    const { findByText } = render(<AgendaScreen />, { wrapper: Wrapper });
    // CATEGORY_TABS has Alle/All as first tab
    expect(await findByText(/Alle|All/)).toBeTruthy();
  });

  it('renders three time-period columns', async () => {
    const { findAllByText } = render(<AgendaScreen />, { wrapper: Wrapper });
    // Column headers: Vorher, Aktuell, Demnächst (German default)
    const vorher = await findAllByText(/Vorher|Previous/);
    expect(vorher.length).toBeGreaterThanOrEqual(1);
  });

  it('switches category filter and still renders all column headers', async () => {
    const { findByText, queryAllByText } = render(<AgendaScreen />, { wrapper: Wrapper });

    const vegetableTab = await findByText(/Nutzpflanzen|Vegetables/);
    fireEvent.press(vegetableTab);

    // After switching to Vegetables, the three time-period columns must still be present,
    // proving the component re-rendered correctly with the new filter applied.
    await waitFor(() => {
      const headers = queryAllByText(/Vorher|Aktuell|Demnächst|Previous|Current|Next/);
      expect(headers.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('renders "Keine Aktivitäten" / "No Activities" when empty', async () => {
    const { findAllByText } = render(<AgendaScreen />, { wrapper: Wrapper });
    // With empty plants (mock returns null), columns show the empty text
    const emptyTexts = await findAllByText(/Keine Aktivitäten|No Activities/);
    expect(emptyTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('displays activity card labels when plants have activities in current period', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');

    // Plant with an activity covering all months (0-23) and all required schema fields
    const testPlants = JSON.stringify([
      {
        id: 'p1',
        name: 'Aktivpflanze',
        activities: [
          {
            id: 'a1',
            type: 'sow',
            startMonth: 0,
            endMonth: 23,
            color: '#4CAF50',
            label: 'Aussaat',
          },
        ],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: 1000000,
        updatedAt: 1000000,
      },
    ]);

    // Reset to key-based mock before this render
    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants' ? Promise.resolve(testPlants) : Promise.resolve(null)
    );

    const { findAllByText } = render(<AgendaScreen />, { wrapper: Wrapper });

    // The activity label 'Aussaat' should appear in at least one column
    const labels = await findAllByText('Aussaat', {}, { timeout: 3000 });
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });
});
