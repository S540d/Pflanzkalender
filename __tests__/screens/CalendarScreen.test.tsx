import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>{children}</PlantProvider>
  </LanguageProvider>
);

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
    fireEvent.press(getByTestId('zoom-out')); // already at min, should not change
    expect(getByTestId('zoom-label').props.children).toBe('75%');
  });

  it('does not exceed maximum zoom when + is pressed at max', async () => {
    const { findByTestId, getByTestId } = render(<CalendarScreen />, { wrapper });
    await findByTestId('zoom-label');
    fireEvent.press(getByTestId('zoom-in'));
    fireEvent.press(getByTestId('zoom-in')); // already at max, should not change
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
