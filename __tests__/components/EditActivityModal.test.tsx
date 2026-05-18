import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { EditActivityModal } from '../../src/components/EditActivityModal';
import { Activity } from '../../src/types';

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
  useLanguage: () => ({
    language: 'de',
    t: (key: string) => {
      const map: Record<string, string> = {
        'activity.edit.title': 'Aktivität bearbeiten',
        'activity.edit.nameLabel': 'Bezeichnung',
        'activity.edit.periodLabel': 'Zeitraum *',
        'activity.edit.deleteTitle': 'Aktivität löschen',
        'activity.edit.deleteMessage': 'Aktivität wirklich löschen?',
        'activity.edit.rangeError': 'Startmonat darf nicht nach dem Endmonat liegen.',
        'activity.add.from': 'Von',
        'activity.add.to': 'Bis',
        'plants.deleteConfirm': 'Löschen',
        'common.cancel': 'Abbrechen',
        'common.save': 'Speichern',
      };
      return map[key] ?? key;
    },
  }),
}));

const mockActivity: Activity = {
  id: 'act-1',
  type: 'sow',
  startMonth: 2,
  endMonth: 4,
  color: '#4CAF50',
  label: 'Aussaat',
};

describe('EditActivityModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible and activity provided', () => {
    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(getByText('Aktivität bearbeiten')).toBeTruthy();
  });

  it('shows plant name as subtitle', () => {
    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Gurke"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(getByText('Gurke')).toBeTruthy();
  });

  it('renders null when activity is null', () => {
    const { queryByText } = render(
      <EditActivityModal
        visible={true}
        activity={null}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(queryByText('Aktivität bearbeiten')).toBeNull();
  });

  it('shows the activity label in the text input', () => {
    const { getByDisplayValue } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(getByDisplayValue('Aussaat')).toBeTruthy();
  });

  it('shows Von and Bis pickers for editing the time range', () => {
    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(getByText('Von')).toBeTruthy();
    expect(getByText('Bis')).toBeTruthy();
  });

  it('calls onUpdate with updated label and months when Speichern is pressed', () => {
    const { getByText, getByDisplayValue } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.changeText(getByDisplayValue('Aussaat'), 'Geänderte Bezeichnung');
    fireEvent.press(getByText('Speichern'));

    expect(mockOnUpdate).toHaveBeenCalledWith('act-1', {
      label: 'Geänderte Bezeichnung',
      startMonth: 2,
      endMonth: 4,
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Abbrechen is pressed', () => {
    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.press(getByText('Abbrechen'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows Alert.alert when Löschen is pressed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('Löschen'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Aktivität löschen',
      'Aktivität wirklich löschen?',
      expect.any(Array)
    );

    alertSpy.mockRestore();
  });

  it('calls onDelete and onClose when delete is confirmed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const deleteButton = buttons?.find((b: any) => b.style === 'destructive');
      deleteButton?.onPress?.();
    });

    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('Löschen'));

    expect(mockOnDelete).toHaveBeenCalledWith('act-1');
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    alertSpy.mockRestore();
  });

  it('does not call onUpdate when startMonth > endMonth', () => {
    const invalidActivity: Activity = { ...mockActivity, startMonth: 10, endMonth: 3 };

    const { getByText } = render(
      <EditActivityModal
        visible={true}
        activity={invalidActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('Speichern'));

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows error message when startMonth > endMonth on save', () => {
    const invalidActivity: Activity = { ...mockActivity, startMonth: 10, endMonth: 3 };

    const { getByText, queryByText } = render(
      <EditActivityModal
        visible={true}
        activity={invalidActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(queryByText(/Startmonat/)).toBeNull();
    fireEvent.press(getByText('Speichern'));
    expect(getByText(/Startmonat/)).toBeTruthy();
  });

  it('syncs state when activity prop changes', () => {
    const { rerender, getByDisplayValue } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const updatedActivity: Activity = { ...mockActivity, label: 'Geändert' };
    rerender(
      <EditActivityModal
        visible={true}
        activity={updatedActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(getByDisplayValue('Geändert')).toBeTruthy();
  });

  it('renders the month picker with month options', () => {
    const { getAllByText } = render(
      <EditActivityModal
        visible={true}
        activity={mockActivity}
        plantName="Tomate"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    // Month picker should contain month labels
    const monthItems = getAllByText(/Jan|Feb|Mär|Apr|Mai/);
    expect(monthItems.length).toBeGreaterThan(0);
  });
});
