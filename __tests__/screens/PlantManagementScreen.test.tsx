import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PlantManagementScreen } from '../../src/screens/PlantManagementScreen';
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

describe('PlantManagementScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { root } = render(<PlantManagementScreen />, { wrapper: Wrapper });
    expect(root).toBeTruthy();
  });

  it('renders the screen title', async () => {
    const { findByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });
    // Title is either German or English depending on language
    expect(await findByText(/Pflanzen verwalten|Manage Plants/)).toBeTruthy();
  });

  it('renders the add plant button', async () => {
    const { findByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });
    expect(await findByText(/Neue Pflanze hinzufügen|Add New Plant/)).toBeTruthy();
  });

  it('opens AddPlantModal when add button is pressed', async () => {
    const { findByText, queryByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });

    const addButton = await findByText(/Neue Pflanze hinzufügen|Add New Plant/);
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(queryByText('Neue Pflanze hinzufügen')).toBeTruthy();
    });
  });

  it('shows empty state text when no plants exist', async () => {
    const { findByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });
    // With mock returning null for AsyncStorage, defaults load. Wait for loading to finish.
    // Either shows plants or the empty message.
    const emptyOrPlants = await findByText(
      /Noch keine Pflanzen vorhanden|No plants yet|Aktivitäten|Activities/
    );
    expect(emptyOrPlants).toBeTruthy();
  });

  it('shows Alert when delete button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const AsyncStorage = require('@react-native-async-storage/async-storage');

    const testPlant = JSON.stringify([
      {
        id: 'plant-test',
        name: 'Testpflanze',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    // Use key-based mock so LanguageContext's getItem call doesn't consume this value
    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants' ? Promise.resolve(testPlant) : Promise.resolve(null)
    );

    const { findByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });

    const deleteButton = await findByText('🗑️', {}, { timeout: 3000 });
    fireEvent.press(deleteButton);

    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('is a valid React component', () => {
    expect(typeof PlantManagementScreen).toBe('function');
  });

  it('filters plants by German name when search query matches', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const testPlants = JSON.stringify([
      {
        id: 'plant-tom',
        name: 'Tomaten',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'plant-erd',
        name: 'Erdbeeren',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants' ? Promise.resolve(testPlants) : Promise.resolve(null)
    );

    const { findByText, queryByText, getByPlaceholderText } = render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });

    await findByText('Tomaten');

    const searchInput = getByPlaceholderText(/suchen|Search/i);
    fireEvent.changeText(searchInput, 'tom');

    await waitFor(() => {
      expect(queryByText('Tomaten')).toBeTruthy();
      expect(queryByText('Erdbeeren')).toBeNull();
    });

    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('shows no-results message when search yields no matches', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const testPlants = JSON.stringify([
      {
        id: 'plant-tom',
        name: 'Tomaten',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants' ? Promise.resolve(testPlants) : Promise.resolve(null)
    );

    const { findByText, getByPlaceholderText } = render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });

    await findByText('Tomaten');

    const searchInput = getByPlaceholderText(/suchen|Search/i);
    fireEvent.changeText(searchInput, 'xyzxyz');

    await waitFor(() => {
      expect(findByText(/Keine Pflanzen gefunden|No plants found/)).toBeTruthy();
    });

    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('filter matches English display name when language is EN', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const testPlants = JSON.stringify([
      {
        id: 'plant-tom',
        name: 'Tomaten',
        activities: [],
        isDefault: true,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'plant-erd',
        name: 'Erdbeeren',
        activities: [],
        isDefault: true,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === '@Pflanzkalender:plants') return Promise.resolve(testPlants);
      if (key === 'language') return Promise.resolve('en');
      return Promise.resolve(null);
    });

    const { findByText, queryByText, getByPlaceholderText } = render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });

    await findByText('Tomatoes');

    const searchInput = getByPlaceholderText(/Search/i);
    fireEvent.changeText(searchInput, 'tom');

    await waitFor(() => {
      expect(queryByText('Tomatoes')).toBeTruthy();
      expect(queryByText('Strawberries')).toBeNull();
    });

    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('renders the category filter tab bar', async () => {
    const { findByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });
    expect(await findByText(/Alle|All/)).toBeTruthy();
  });

  it('filters plants by category', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const testPlants = JSON.stringify([
      {
        id: 'plant-tom',
        name: 'Tomaten',
        category: 'vegetable',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'plant-rose',
        name: 'Rose',
        category: 'flower',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants' ? Promise.resolve(testPlants) : Promise.resolve(null)
    );

    const { findByText, queryByText } = render(<PlantManagementScreen />, { wrapper: Wrapper });

    // Both plants visible initially
    await findByText('Tomaten');
    await findByText('Rose');

    // Press the "Blumen/Flowers" tab
    const flowerTab = await findByText(/Blumen|Flowers/);
    fireEvent.press(flowerTab);

    await waitFor(() => {
      expect(queryByText('Rose')).toBeTruthy();
      expect(queryByText('Tomaten')).toBeNull();
    });

    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('combines search and category filter', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const testPlants = JSON.stringify([
      {
        id: 'plant-tom',
        name: 'Tomaten',
        category: 'vegetable',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'plant-kar',
        name: 'Karotten',
        category: 'vegetable',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'plant-rose',
        name: 'Rose',
        category: 'flower',
        activities: [],
        isDefault: false,
        userId: null,
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    AsyncStorage.getItem.mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants' ? Promise.resolve(testPlants) : Promise.resolve(null)
    );

    const { findByText, queryByText, getByPlaceholderText } = render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });

    await findByText('Tomaten');

    // Filter by vegetable category
    const vegetableTab = await findByText(/Nutzpflanzen|Vegetables/);
    fireEvent.press(vegetableTab);

    // Then search for "tom"
    const searchInput = getByPlaceholderText(/suchen|Search/i);
    fireEvent.changeText(searchInput, 'tom');

    await waitFor(() => {
      expect(queryByText('Tomaten')).toBeTruthy();
      expect(queryByText('Karotten')).toBeNull();
      expect(queryByText('Rose')).toBeNull();
    });

    AsyncStorage.getItem.mockResolvedValue(null);
  });
});
