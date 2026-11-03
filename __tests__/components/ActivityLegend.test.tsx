import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityLegend } from '../../src/components/ActivityLegend';
import { ACTIVITY_TYPES } from '../../src/constants/activityTypes';

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: { textSecondary: '#666', border: '#ddd', surfaceElevated: '#fff' },
  }),
}));

// Übersetzung fehlt -> Fallback auf das Label des Typs
jest.mock('../../src/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key, language: 'de' }),
}));

describe('ActivityLegend', () => {
  it('listet alle Aktivitätstypen mit Namen', async () => {
    const { getByText, getByTestId } = await render(<ActivityLegend />);
    expect(getByTestId('activity-legend')).toBeTruthy();
    ACTIVITY_TYPES.forEach((type) => expect(getByText(type.label)).toBeTruthy());
  });
});
