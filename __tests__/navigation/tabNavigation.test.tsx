/**
 * Navigation integration tests.
 *
 * Simulates the user switching between tabs by rendering multiple screen
 * components within a single shared provider tree and verifying that:
 *   - shared PlantContext state is consistent across screens
 *   - shared LanguageContext state propagates to all screens
 *   - data loaded from AsyncStorage is visible in each screen independently
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { AgendaScreen } from '../../src/screens/AgendaScreen';
import { ClimateScreen } from '../../src/screens/ClimateScreen';
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
    isDark: false,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

const SharedProviders = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>{children}</PlantProvider>
  </LanguageProvider>
);

const testPlant = {
  id: 'nav-test-1',
  name: 'Lavendel',
  activities: [
    {
      id: 'a1',
      type: 'plant',
      startMonth: 0,
      endMonth: 23,
      color: '#9C27B0',
      label: 'Pflanzen',
    },
  ],
  isDefault: false,
  userId: null,
  notes: '',
  createdAt: 1000000,
  updatedAt: 1000000,
};

describe('Tab Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('AgendaScreen renders within shared providers without crashing', async () => {
    const { root } = render(<AgendaScreen />, { wrapper: SharedProviders });
    expect(root).toBeTruthy();
  });

  it('ClimateScreen renders within shared providers without crashing', async () => {
    const { root } = render(<ClimateScreen />, { wrapper: SharedProviders });
    expect(root).toBeTruthy();
  });

  it('plant loaded from storage appears in AgendaScreen activity columns', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(JSON.stringify([testPlant]))
        : Promise.resolve(null)
    );

    const { findAllByText } = render(<AgendaScreen />, { wrapper: SharedProviders });

    const labels = await findAllByText('Pflanzen', {}, { timeout: 3000 });
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it('plant in storage is reflected as "Bereits im Garten" in ClimateScreen', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(JSON.stringify([testPlant]))
        : Promise.resolve(null)
    );

    const { findByText } = render(<ClimateScreen />, { wrapper: SharedProviders });

    expect(await findByText('Bereits im Garten')).toBeTruthy();
  });

  it('both screens see same plant data when rendered under one PlantProvider', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(JSON.stringify([testPlant]))
        : Promise.resolve(null)
    );

    // Both screens mount under the same provider tree – shared PlantContext state
    const { findAllByText, findByText } = render(
      <>
        <AgendaScreen />
        <ClimateScreen />
      </>,
      { wrapper: SharedProviders }
    );

    // AgendaScreen receives the plant activity from the shared context
    const activityLabels = await findAllByText('Pflanzen', {}, { timeout: 3000 });
    expect(activityLabels.length).toBeGreaterThanOrEqual(1);

    // ClimateScreen sees the same plant as already in garden via the same PlantContext
    expect(await findByText('Bereits im Garten')).toBeTruthy();
  });

  it('language stored as EN propagates to AgendaScreen column headers', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === 'language') return Promise.resolve('en');
      return Promise.resolve(null);
    });

    const { findAllByText } = render(<AgendaScreen />, { wrapper: SharedProviders });

    const headers = await findAllByText(/Previous|Current|Next/, {}, { timeout: 3000 });
    expect(headers.length).toBeGreaterThanOrEqual(1);
  });

  it('language stored as EN propagates to ClimateScreen title', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === 'language') return Promise.resolve('en');
      return Promise.resolve(null);
    });

    const { findByText } = render(<ClimateScreen />, { wrapper: SharedProviders });
    expect(await findByText('Climate-Resilient Gardening')).toBeTruthy();
  });
});
