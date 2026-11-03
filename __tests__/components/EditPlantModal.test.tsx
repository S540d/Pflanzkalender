import React from 'react';
import { Alert } from 'react-native';
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
        'plants.deleteTitle': 'Pflanze löschen',
        'plants.deleteMessage': 'wirklich löschen?',
        'plants.deleteConfirm': 'Löschen',
        'plants.deleteCancel': 'Abbrechen',
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

  describe('Löschen', () => {
    it('zeigt „Pflanze löschen" nur, wenn onDelete übergeben wird', async () => {
      const without = await render(
        <EditPlantModal visible plant={mockPlant} onClose={mockOnClose} onSave={mockOnSave} />
      );
      expect(without.queryByTestId('edit-plant-delete')).toBeNull();
      await without.unmount();

      const withDelete = await render(
        <EditPlantModal
          visible
          plant={mockPlant}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={jest.fn()}
        />
      );
      expect(withDelete.getByTestId('edit-plant-delete')).toBeTruthy();
    });

    it('fragt nach und löscht erst nach Bestätigung, dann schließt der Dialog', async () => {
      const onDelete = jest.fn();
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const { getByTestId } = await render(
        <EditPlantModal
          visible
          plant={mockPlant}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={onDelete}
        />
      );

      await fireEvent.press(getByTestId('edit-plant-delete'));

      expect(alertSpy).toHaveBeenCalledWith(
        'Pflanze löschen',
        '"Tomate" wirklich löschen?',
        expect.any(Array)
      );
      expect(onDelete).not.toHaveBeenCalled();

      const buttons = alertSpy.mock.calls[0][2] as { style?: string; onPress?: () => void }[];
      buttons.find((b) => b.style === 'destructive')?.onPress?.();

      expect(onDelete).toHaveBeenCalledWith('plant-1');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      alertSpy.mockRestore();
    });

    it('löscht nicht, wenn die Rückfrage abgebrochen wird', async () => {
      const onDelete = jest.fn();
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const { getByTestId } = await render(
        <EditPlantModal
          visible
          plant={mockPlant}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={onDelete}
        />
      );

      await fireEvent.press(getByTestId('edit-plant-delete'));
      const buttons = alertSpy.mock.calls[0][2] as { style?: string; onPress?: () => void }[];
      buttons.find((b) => b.style === 'cancel')?.onPress?.();

      expect(onDelete).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });
});
