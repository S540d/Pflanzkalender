import React from 'react';
import { render } from '@testing-library/react-native';
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

describe('CalendarScreen – Rendering', () => {
  it('renders without crashing with required providers', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>
        <PlantProvider>{children}</PlantProvider>
      </LanguageProvider>
    );

    const { getByTestId } = render(<CalendarScreen />, { wrapper });

    // Verify screen renders (at least one element should exist)
    expect(getByTestId('calendar-screen')).toBeTruthy();
  });

  it('is a valid React component', () => {
    expect(typeof CalendarScreen).toBe('function');
  });
});
