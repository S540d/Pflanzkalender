import React from 'react';
import { render } from '@testing-library/react-native';
import {
  ActivityBar,
  MIN_BAR_WIDTH_FOR_LABEL,
  shouldShowBarLabel,
} from '../../src/components/ActivityBar';

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

jest.mock('../../src/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key, language: 'de' }),
}));

describe('ActivityBar Component', () => {
  const mockActivity = {
    id: 'test-activity',
    type: 'sow' as const,
    startMonth: 0,
    endMonth: 5,
    color: '#4CAF50',
    label: 'Aussaat',
  };

  it('renders without crashing', async () => {
    const { root } = await render(<ActivityBar activity={mockActivity} />);

    expect(root).toBeTruthy();
  });

  it('is a valid React component', () => {
    expect(typeof ActivityBar).toBe('function');
  });

  it('renders activity bar with label', async () => {
    const { getByText } = await render(<ActivityBar activity={mockActivity} />);

    expect(getByText('Aussaat')).toBeTruthy();
  });

  it('renders activity bar with correct styling', async () => {
    const { root } = await render(
      <ActivityBar
        activity={{
          ...mockActivity,
          type: 'harvest',
          startMonth: 6,
          endMonth: 12,
          color: '#FF6B6B',
          label: 'Ernte',
        }}
      />
    );

    expect(root).toBeTruthy();
  });

  it('zeigt bei ausreichender Breite Icon und Label', async () => {
    const { getByText } = await render(<ActivityBar activity={mockActivity} cellWidth={60} />);
    expect(getByText('Aussaat')).toBeTruthy();
  });

  it('zeigt bei schmalem Balken nur das Icon, der Name bleibt als Accessibility-Label', async () => {
    const { queryByText, getByLabelText } = await render(
      <ActivityBar activity={{ ...mockActivity, startMonth: 2, endMonth: 2 }} cellWidth={60} />
    );
    expect(queryByText('Aussaat')).toBeNull();
    expect(getByLabelText('Aussaat')).toBeTruthy();
  });
});

describe('shouldShowBarLabel', () => {
  it('braucht die Mindestbreite für das Label', () => {
    expect(shouldShowBarLabel(1, 60)).toBe(false);
    expect(shouldShowBarLabel(2, 40)).toBe(false); // 80 px < 84
    expect(shouldShowBarLabel(2, 60)).toBe(true);
    expect(shouldShowBarLabel(3, 40)).toBe(true);
    expect(shouldShowBarLabel(1, MIN_BAR_WIDTH_FOR_LABEL)).toBe(true);
  });
});
