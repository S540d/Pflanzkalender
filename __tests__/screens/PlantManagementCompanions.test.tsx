import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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

const makePlant = (id: string, name: string) => ({
  id,
  name,
  activities: [],
  isDefault: false,
  userId: null,
  notes: '',
  createdAt: 1,
  updatedAt: 1,
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest
    .fn()
    .mockImplementation((key: string) =>
      key === '@Pflanzkalender:plants'
        ? Promise.resolve(
            JSON.stringify([makePlant('p-tom', 'Tomaten'), makePlant('p-own', 'Eigene Pflanze')])
          )
        : Promise.resolve(null)
    ),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <PlantProvider>{children}</PlantProvider>
  </LanguageProvider>
);

describe('PlantManagementScreen – Mischkultur', () => {
  it('klappt Nachbarschaftshinweise per Tap auf und wieder zu', async () => {
    const { findByTestId, queryByTestId, getByTestId } = await render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });

    const toggle = await findByTestId('companions-toggle-p-tom');
    expect(queryByTestId('companions-p-tom')).toBeNull();

    await fireEvent.press(toggle);
    const box = getByTestId('companions-p-tom');
    expect(box).toBeTruthy();

    await fireEvent.press(toggle);
    expect(queryByTestId('companions-p-tom')).toBeNull();
  });

  it('zeigt gute und schlechte Nachbarn mit lokalisierten Namen', async () => {
    const { findByTestId, findByText } = await render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });
    await fireEvent.press(await findByTestId('companions-toggle-p-tom'));

    expect(await findByText(/Gute Nachbarn.*Basilikum.*Knoblauch/)).toBeTruthy();
    expect(await findByText(/Besser getrennt halten.*Kartoffeln.*Gurken/)).toBeTruthy();
  });

  it('bietet für eigene Pflanzen ohne Daten keinen Mischkultur-Toggle an', async () => {
    const { findByTestId, queryByTestId } = await render(<PlantManagementScreen />, {
      wrapper: Wrapper,
    });
    await findByTestId('companions-toggle-p-tom');
    expect(queryByTestId('companions-toggle-p-own')).toBeNull();
  });
});
