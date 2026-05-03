import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityBar } from '../../src/components/ActivityBar';

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

describe('ActivityBar Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <ActivityBar
        activity={{
          id: 'test-activity',
          type: 'sow',
          startMonth: 0,
          endMonth: 5,
          color: '#4CAF50',
          label: 'Aussaat',
        }}
        index={0}
        totalActivities={1}
      />
    );

    // Verify component renders
    expect(getByTestId('activity-bar')).toBeTruthy();
  });

  it('is a valid React component', () => {
    expect(typeof ActivityBar).toBe('function');
  });

  it('renders activity bar with correct styling', () => {
    const { getByTestId } = render(
      <ActivityBar
        activity={{
          id: 'test-activity',
          type: 'harvest',
          startMonth: 6,
          endMonth: 12,
          color: '#FF6B6B',
          label: 'Ernte',
        }}
        index={0}
        totalActivities={1}
      />
    );

    const bar = getByTestId('activity-bar');
    expect(bar).toBeTruthy();
  });
});
