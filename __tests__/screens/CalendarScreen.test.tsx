import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CalendarScreen } from '../../src/screens/CalendarScreen';
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
    themeMode: 'light',
    setThemeMode: jest.fn(),
  }),
}));

const testPlant = {
  id: 'plant-1',
  name: 'Tomate',
  isDefault: false,
  userId: null,
  activities: [],
  notes: '',
  createdAt: 1748736000000,
  updatedAt: 1748736000000,
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest
    .fn()
    .mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(JSON.stringify([testPlant]))
        : Promise.resolve(null)
    ),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

// Capture callbacks passed to PlantRowsContainer so tests can trigger them
let capturedOnPressMonth: ((plantId: string, monthIndex: number) => void) | null = null;
let capturedOnPressMonthRange: ((plantId: string, start: number, end: number) => void) | null =
  null;

jest.mock('../../src/components/PlantRowsContainer', () => ({
  PlantRowsContainer: (props: {
    onPressMonth: (plantId: string, monthIndex: number) => void;
    onPressMonthRange: (plantId: string, start: number, end: number) => void;
  }) => {
    capturedOnPressMonth = props.onPressMonth;
    capturedOnPressMonthRange = props.onPressMonthRange;
    return null;
  },
}));

jest.mock('../../src/components/AddActivityModal', () => ({
  AddActivityModal: (props: {
    visible: boolean;
    initialMonth?: number;
    initialEndMonth?: number;
    plantName?: string;
    onClose?: () => void;
    onAdd?: () => void;
  }) => {
    const { View, Text } = require('react-native');
    if (!props.visible) return null;
    return (
      <View testID="add-activity-modal">
        <Text testID="modal-initial-month">{props.initialMonth ?? 'none'}</Text>
        <Text testID="modal-initial-end-month">{props.initialEndMonth ?? 'none'}</Text>
      </View>
    );
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>{children}</PlantProvider>
  </LanguageProvider>
);

beforeEach(() => {
  capturedOnPressMonth = null;
  capturedOnPressMonthRange = null;
});

describe('CalendarScreen – Rendering', () => {
  it('renders without crashing with required providers', () => {
    const { root } = render(<CalendarScreen />, { wrapper });
    expect(root).toBeTruthy();
  });

  it('is a valid React component', () => {
    expect(typeof CalendarScreen).toBe('function');
  });
});

describe('CalendarScreen – Zoom controls', () => {
  it('renders zoom bar with initial 100% label', async () => {
    const { findByTestId } = render(<CalendarScreen />, { wrapper });
    const label = await findByTestId('zoom-label');
    expect(label.props.children).toBe('100%');
  });

  it('decreases zoom level when − button is pressed', async () => {
    const { findByTestId, getByTestId } = render(<CalendarScreen />, { wrapper });
    await findByTestId('zoom-label');
    fireEvent.press(getByTestId('zoom-out'));
    expect(getByTestId('zoom-label').props.children).toBe('75%');
  });

  it('increases zoom level when + button is pressed', async () => {
    const { findByTestId, getByTestId } = render(<CalendarScreen />, { wrapper });
    await findByTestId('zoom-label');
    fireEvent.press(getByTestId('zoom-in'));
    expect(getByTestId('zoom-label').props.children).toBe('133%');
  });

  it('does not go below minimum zoom when − is pressed at min', async () => {
    const { findByTestId, getByTestId } = render(<CalendarScreen />, { wrapper });
    await findByTestId('zoom-label');
    fireEvent.press(getByTestId('zoom-out'));
    fireEvent.press(getByTestId('zoom-out'));
    expect(getByTestId('zoom-label').props.children).toBe('75%');
  });

  it('does not exceed maximum zoom when + is pressed at max', async () => {
    const { findByTestId, getByTestId } = render(<CalendarScreen />, { wrapper });
    await findByTestId('zoom-label');
    fireEvent.press(getByTestId('zoom-in'));
    fireEvent.press(getByTestId('zoom-in'));
    expect(getByTestId('zoom-label').props.children).toBe('133%');
  });

  it('zoom-out button has correct accessibility attributes', async () => {
    const { findByTestId } = render(<CalendarScreen />, { wrapper });
    const btn = await findByTestId('zoom-out');
    expect(btn.props.accessibilityRole).toBe('button');
    expect(btn.props.accessibilityLabel).toBe('Zoom out');
  });

  it('zoom-in button has correct accessibility attributes', async () => {
    const { findByTestId } = render(<CalendarScreen />, { wrapper });
    const btn = await findByTestId('zoom-in');
    expect(btn.props.accessibilityRole).toBe('button');
    expect(btn.props.accessibilityLabel).toBe('Zoom in');
  });
});

describe('CalendarScreen – Drag-to-create range selection', () => {
  // In the test environment Dimensions returns portrait (750x1334),
  // so CalendarScreen maps indices via portrait formula: startHalf = idx*4, endHalf = min(idx*4+3, 23)
  // AddActivityModal only renders when selectedPlant is set, so we must wait for plant loading first.

  async function waitForReady() {
    // Wait until PlantRowsContainer has been rendered (callbacks captured) and
    // PlantContext has finished loading from AsyncStorage (getItem resolves async).
    await waitFor(() => {
      expect(capturedOnPressMonthRange).not.toBeNull();
      expect(capturedOnPressMonth).not.toBeNull();
    });
    // Flush all pending microtasks / state updates from the async AsyncStorage load
    await new Promise((r) => setImmediate(r));
    await new Promise((r) => setImmediate(r));
  }

  it('opens AddActivityModal when onPressMonthRange is triggered', async () => {
    const { queryByTestId } = render(<CalendarScreen />, { wrapper });
    expect(queryByTestId('add-activity-modal')).toBeFalsy();

    await waitForReady();
    capturedOnPressMonthRange!('plant-1', 2, 4);

    await waitFor(() => expect(queryByTestId('add-activity-modal')).toBeTruthy());
  });

  it('maps portrait indices correctly: startHalf=idx*4, endHalf=min(idx*4+3,23)', async () => {
    const { queryByTestId } = render(<CalendarScreen />, { wrapper });

    await waitForReady();
    // idx 2..4 → startHalf=8, endHalf=19
    capturedOnPressMonthRange!('plant-1', 2, 4);

    await waitFor(() => {
      expect(queryByTestId('modal-initial-month')?.props.children).toBe(8);
      expect(queryByTestId('modal-initial-end-month')?.props.children).toBe(19);
    });
  });

  it('clamps endHalf to 23 for last portrait cell', async () => {
    const { queryByTestId } = render(<CalendarScreen />, { wrapper });

    await waitForReady();
    // idx 5..5 → startHalf=20, endHalf=min(23,23)=23
    capturedOnPressMonthRange!('plant-1', 5, 5);

    await waitFor(() => {
      expect(queryByTestId('modal-initial-month')?.props.children).toBe(20);
      expect(queryByTestId('modal-initial-end-month')?.props.children).toBe(23);
    });
  });

  it('opens AddActivityModal when a single month is pressed', async () => {
    const { queryByTestId } = render(<CalendarScreen />, { wrapper });
    expect(queryByTestId('add-activity-modal')).toBeFalsy();

    await waitForReady();
    capturedOnPressMonth!('plant-1', 1);

    await waitFor(() => expect(queryByTestId('add-activity-modal')).toBeTruthy());
  });

  it('passes initialMonth (portrait: idx*4) without initialEndMonth for single-month press', async () => {
    const { queryByTestId } = render(<CalendarScreen />, { wrapper });

    await waitForReady();
    // idx 1 → selectedMonth = 1*4 = 4, selectedEndMonth = undefined
    capturedOnPressMonth!('plant-1', 1);

    await waitFor(() => {
      expect(queryByTestId('modal-initial-month')?.props.children).toBe(4);
      expect(queryByTestId('modal-initial-end-month')?.props.children).toBe('none');
    });
  });
});
