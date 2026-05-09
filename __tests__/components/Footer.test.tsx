import React from 'react';
import { Linking } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Footer } from '../../src/components/Footer';

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

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { root } = render(<Footer />);
    expect(root).toBeTruthy();
  });

  it('renders the support button label', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Support me')).toBeTruthy();
  });

  it('renders the coffee icon', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('☕')).toBeTruthy();
  });

  it('calls Linking.openURL with Ko-fi URL when button is pressed', () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);

    const { getByText } = render(<Footer />);
    fireEvent.press(getByText('Support me'));

    expect(openURLSpy).toHaveBeenCalledWith('https://ko-fi.com/devsven');
    openURLSpy.mockRestore();
  });

  it('is a valid React component', () => {
    expect(typeof Footer).toBe('function');
  });
});
