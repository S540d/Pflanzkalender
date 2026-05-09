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

  it('calls onUpdate with new label when Speichern is pressed', () => {
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

    expect(mockOnUpdate).toHaveBeenCalledWith('act-1', { label: 'Geänderte Bezeichnung' });
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

  it('displays the time range of the activity', () => {
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
    // Should display month names for startMonth=2 and endMonth=4
    expect(getByText(/Feb|Mär|Apr/)).toBeTruthy();
  });

  it('syncs label state when activity prop changes', () => {
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
});
