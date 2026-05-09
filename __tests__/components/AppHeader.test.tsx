import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AppHeader } from '../../src/components/AppHeader';

const mockNavigate = jest.fn();

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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useRoute: () => ({
    name: 'Kalender',
  }),
}));

describe('AppHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { root } = render(<AppHeader />);
    expect(root).toBeTruthy();
  });

  it('renders Kalender tab button', () => {
    const { getByText } = render(<AppHeader />);
    expect(getByText('Kalender')).toBeTruthy();
  });

  it('renders Agenda tab button', () => {
    const { getByText } = render(<AppHeader />);
    expect(getByText('Agenda')).toBeTruthy();
  });

  it('renders leftContent when provided', () => {
    const { getByText } = render(<AppHeader leftContent={<Text>LeftSlot</Text>} />);
    expect(getByText('LeftSlot')).toBeTruthy();
  });

  it('renders rightContent when provided', () => {
    const { getByText } = render(<AppHeader rightContent={<Text>RightSlot</Text>} />);
    expect(getByText('RightSlot')).toBeTruthy();
  });

  it('navigates to Kalender when Kalender tab is pressed', () => {
    const { getByText } = render(<AppHeader />);
    fireEvent.press(getByText('Kalender'));
    expect(mockNavigate).toHaveBeenCalledWith('Kalender');
  });

  it('navigates to Agenda when Agenda tab is pressed', () => {
    const { getByText } = render(<AppHeader />);
    fireEvent.press(getByText('Agenda'));
    expect(mockNavigate).toHaveBeenCalledWith('Agenda');
  });

  it('navigates to Einstellungen when settings button is pressed', () => {
    const { getByTestId } = render(<AppHeader />);
    fireEvent.press(getByTestId('settings-button'));
    expect(mockNavigate).toHaveBeenCalledWith('Einstellungen');
  });

  it('is a valid React component', () => {
    expect(typeof AppHeader).toBe('function');
  });
});
