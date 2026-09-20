import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ClimateScreen } from '../../src/screens/ClimateScreen';

const mockAddPlant = jest.fn();
const mockPlants: { id: string; name: string }[] = [];

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ddd',
      surface: '#f5f5f5',
      primary: '#4CAF50',
    },
  }),
}));

jest.mock('../../src/contexts/LanguageContext', () => ({
  useLanguage: () => ({ language: 'de' }),
}));

jest.mock('../../src/contexts/PlantContext', () => ({
  usePlants: () => ({ plants: mockPlants, addPlant: mockAddPlant }),
}));

describe('ClimateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlants.length = 0;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', async () => {
    const { getByText } = await render(<ClimateScreen />);
    expect(getByText('Klimafit gärtnern')).toBeTruthy();
  });

  it('shows "Zum Garten hinzufügen" button for each visible recommendation', async () => {
    const { getAllByText } = await render(<ClimateScreen />);
    const buttons = getAllByText('Zum Garten hinzufügen');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls addPlant and shows "Hinzugefügt ✓" state on press', async () => {
    const { getAllByText, queryAllByText } = await render(<ClimateScreen />);
    const addButtons = getAllByText('Zum Garten hinzufügen');
    await fireEvent.press(addButtons[0]);
    expect(mockAddPlant).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(queryAllByText('Hinzugefügt ✓').length).toBeGreaterThan(0));
  });

  it('reverts "Hinzugefügt ✓" back after 2 seconds', async () => {
    const { getAllByText, queryAllByText } = await render(<ClimateScreen />);
    await fireEvent.press(getAllByText('Zum Garten hinzufügen')[0]);
    await waitFor(() => expect(queryAllByText('Hinzugefügt ✓').length).toBeGreaterThan(0));
    await act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => expect(queryAllByText('Hinzugefügt ✓').length).toBe(0));
  });

  it('disables button and shows "Bereits im Garten" when plant already exists', async () => {
    mockPlants.push({ id: '1', name: 'Süßkartoffel' });
    const { getByText } = await render(<ClimateScreen />);
    expect(getByText('Bereits im Garten')).toBeTruthy();
  });

  it('does not call addPlant again on double-tap', async () => {
    const { getAllByText } = await render(<ClimateScreen />);
    const addButtons = getAllByText('Zum Garten hinzufügen');
    await fireEvent.press(addButtons[0]);
    await fireEvent.press(addButtons[0]);
    expect(mockAddPlant).toHaveBeenCalledTimes(1);
  });

  it('renders all 4 filter tabs', async () => {
    const { getByText } = await render(<ClimateScreen />);
    expect(getByText('Alle')).toBeTruthy();
    expect(getByText('Nutzpflanzen')).toBeTruthy();
    expect(getByText('Blumen')).toBeTruthy();
    expect(getByText('Bäume')).toBeTruthy();
  });

  it('filters to vegetables when Nutzpflanzen tab is pressed', async () => {
    const { getByText, queryByText } = await render(<ClimateScreen />);

    await fireEvent.press(getByText('Nutzpflanzen'));

    expect(queryByText('Süßkartoffel')).toBeTruthy();
    expect(queryByText('Lavendel')).toBeNull();
    expect(queryByText('Edelkastanie')).toBeNull();
  });

  it('filters to flowers when Blumen tab is pressed', async () => {
    const { getByText, queryByText } = await render(<ClimateScreen />);

    await fireEvent.press(getByText('Blumen'));

    expect(queryByText('Lavendel')).toBeTruthy();
    expect(queryByText('Süßkartoffel')).toBeNull();
    expect(queryByText('Edelkastanie')).toBeNull();
  });

  it('filters to trees when Bäume tab is pressed', async () => {
    const { getByText, queryByText } = await render(<ClimateScreen />);

    await fireEvent.press(getByText('Bäume'));

    expect(queryByText('Edelkastanie')).toBeTruthy();
    expect(queryByText('Süßkartoffel')).toBeNull();
    expect(queryByText('Lavendel')).toBeNull();
  });

  it('shows all recommendations again when Alle tab is re-selected', async () => {
    const { getByText, queryByText } = await render(<ClimateScreen />);

    await fireEvent.press(getByText('Nutzpflanzen'));
    await fireEvent.press(getByText('Alle'));

    expect(queryByText('Süßkartoffel')).toBeTruthy();
    expect(queryByText('Lavendel')).toBeTruthy();
    expect(queryByText('Edelkastanie')).toBeTruthy();
  });
});
