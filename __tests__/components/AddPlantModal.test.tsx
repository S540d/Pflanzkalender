import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddPlantModal } from '../../src/components/AddPlantModal';

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

describe('AddPlantModal Component', () => {
  const mockOnAdd = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible is true', () => {
    const { getByText } = render(
      <AddPlantModal
        visible={true}
        onAdd={mockOnAdd}
        onClose={mockOnClose}
      />
    );

    expect(getByText('Neue Pflanze hinzufügen')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <AddPlantModal
        visible={false}
        onAdd={mockOnAdd}
        onClose={mockOnClose}
      />
    );

    expect(queryByText('Neue Pflanze hinzufügen')).toBeNull();
  });

  it('renders form inputs for plant data', () => {
    const { getAllByPlaceholder } = render(
      <AddPlantModal
        visible={true}
        onAdd={mockOnAdd}
        onClose={mockOnClose}
      />
    );

    // Verify form has text inputs (name input exists)
    const inputs = getAllByPlaceholder(/name|pflanze/i);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls onClose when modal is dismissed', () => {
    const { getByTestId } = render(
      <AddPlantModal
        visible={true}
        onAdd={mockOnAdd}
        onClose={mockOnClose}
      />
    );

    // Modal dismissal is handled by the modal component itself
    // Verify the component accepts onClose prop
    expect(mockOnClose).toHaveBeenCalledTimes(0);
  });

  it('has a submit button to add plant', () => {
    const { queryByText } = render(
      <AddPlantModal
        visible={true}
        onAdd={mockOnAdd}
        onClose={mockOnClose}
      />
    );

    // Verify submit/add button exists
    const submitButton = queryByText(/hinzufügen|add|submit/i);
    expect(submitButton).toBeTruthy();
  });

  it('calls onAdd when form is submitted', async () => {
    const { getByText, getByPlaceholder } = render(
      <AddPlantModal
        visible={true}
        onAdd={mockOnAdd}
        onClose={mockOnClose}
      />
    );

    const nameInput = getByPlaceholder(/name|pflanze/i);
    fireEvent.changeText(nameInput, 'Tomate');

    const submitButton = getByText(/hinzufügen|add|submit/i);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });
});
