import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EditPlantModal } from '../../src/components/EditPlantModal';
import { Plant } from '../../src/types';

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
  useLanguage: () => ({
    language: 'de',
    t: (key: string) => {
      const map: Record<string, string> = {
        'plants.editTitle': 'Pflanze bearbeiten',
        'plants.fieldName': 'Pflanzenname',
        'plants.fieldNotes': 'Notizen',
        'plants.fieldLocation': 'Standort',
        'plants.fieldCategory': 'Kategorie',
        'plants.editSave': 'Speichern',
        'common.cancel': 'Abbrechen',
      };
      return map[key] ?? key;
    },
  }),
}));

const mockPlant: Plant = {
  id: 'plant-1',
  name: 'Tomate',
  isDefault: false,
  userId: null,
  activities: [],
  notes: 'Sommergemüse',
  location: 'sun',
  category: 'vegetable',
  createdAt: 1000000,
  updatedAt: 1000000,
};

describe('EditPlantModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible is true', async () => {
    const { getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(getByText('Pflanze bearbeiten')).toBeTruthy();
  });

  it('does not render content when visible is false', async () => {
    const { queryByText } = await render(
      <EditPlantModal visible={false} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(queryByText('Pflanze bearbeiten')).toBeNull();
  });

  it('pre-fills the name input with plant name', async () => {
    const { getByDisplayValue } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(getByDisplayValue('Tomate')).toBeTruthy();
  });

  it('pre-fills the notes input with plant notes', async () => {
    const { getByDisplayValue } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(getByDisplayValue('Sommergemüse')).toBeTruthy();
  });

  it('renders location and category fields', async () => {
    const { getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(getByText('Standort')).toBeTruthy();
    expect(getByText('Kategorie')).toBeTruthy();
  });

  it('renders Speichern and Abbrechen buttons', async () => {
    const { getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(getByText('Speichern')).toBeTruthy();
    expect(getByText('Abbrechen')).toBeTruthy();
  });

  it('calls onClose when Abbrechen is pressed', async () => {
    const { getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    await fireEvent.press(getByText('Abbrechen'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with updated name when Speichern is pressed', async () => {
    const { getByDisplayValue, getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    await fireEvent.changeText(getByDisplayValue('Tomate'), 'Gurke');
    await fireEvent.press(getByText('Speichern'));
    expect(mockOnSave).toHaveBeenCalledWith('plant-1', expect.objectContaining({ name: 'Gurke' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onSave when name is empty', async () => {
    const { getByDisplayValue, getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    await fireEvent.changeText(getByDisplayValue('Tomate'), '');
    await fireEvent.press(getByText('Speichern'));
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with trimmed name and notes', async () => {
    const { getByDisplayValue, getByText } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    await fireEvent.changeText(getByDisplayValue('Tomate'), '  Basilikum  ');
    await fireEvent.changeText(getByDisplayValue('Sommergemüse'), '  Kräuter  ');
    await fireEvent.press(getByText('Speichern'));
    expect(mockOnSave).toHaveBeenCalledWith('plant-1', {
      name: 'Basilikum',
      notes: 'Kräuter',
      location: 'sun',
      category: 'vegetable',
    });
  });

  it('syncs state when plant prop changes on visibility toggle', async () => {
    const { rerender, getByDisplayValue } = await render(
      <EditPlantModal visible={true} plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
    );
    const updatedPlant: Plant = { ...mockPlant, name: 'Paprika', notes: '' };
    await rerender(
      <EditPlantModal
        visible={true}
        plant={updatedPlant}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(getByDisplayValue('Paprika')).toBeTruthy();
  });

  it('renders plant without optional fields without crashing', async () => {
    const minimalPlant: Plant = {
      id: 'plant-2',
      name: 'Minze',
      isDefault: false,
      userId: null,
      activities: [],
      notes: '',
      createdAt: 1000000,
      updatedAt: 1000000,
    };
    const { getByDisplayValue } = await render(
      <EditPlantModal
        visible={true}
        plant={minimalPlant}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(getByDisplayValue('Minze')).toBeTruthy();
  });
});
