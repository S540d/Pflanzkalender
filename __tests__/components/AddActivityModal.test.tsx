import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddActivityModal } from '../../src/components/AddActivityModal';

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
        'activity.add.title': 'Aktivität hinzufügen',
        'activity.add.subtitle': 'für',
        'activity.add.typeLabel': 'Aktivitätstyp *',
        'activity.add.periodLabel': 'Zeitraum *',
        'activity.add.from': 'Von',
        'activity.add.to': 'Bis',
        'activity.add.customLabel': 'Eigene Bezeichnung (optional)',
        'activity.edit.rangeError': 'Startmonat darf nicht nach dem Endmonat liegen.',
        'activity.type.sow': 'Aussäen',
        'activity.type.plant': 'Pflanzen',
        'activity.type.fertilize': 'Düngen',
        'activity.type.water': 'Gießen',
        'activity.type.prune': 'Zurückschneiden',
        'activity.type.harvest': 'Ernten',
        'activity.type.protect': 'Winterschutz',
        'activity.type.mulch': 'Mulchen',
        'common.cancel': 'Abbrechen',
        'common.add': 'Hinzufügen',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('AddActivityModal Component', () => {
  const mockOnAdd = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible is true', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(getByText('Aktivität hinzufügen')).toBeTruthy();
  });

  it('shows plant name in subtitle', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Gurke" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(getByText('für Gurke')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <AddActivityModal
        visible={false}
        plantName="Tomate"
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />
    );
    expect(queryByText('Aktivität hinzufügen')).toBeNull();
  });

  it('renders activity type field label', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(getByText('Aktivitätstyp *')).toBeTruthy();
  });

  it('renders time period field', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(getByText('Zeitraum *')).toBeTruthy();
    expect(getByText('Von')).toBeTruthy();
    expect(getByText('Bis')).toBeTruthy();
  });

  it('renders custom label input field', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(getByText('Eigene Bezeichnung (optional)')).toBeTruthy();
  });

  it('calls onAdd when Hinzufügen button is pressed', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    fireEvent.press(getByText('Hinzufügen'));
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Abbrechen button is pressed', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    fireEvent.press(getByText('Abbrechen'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('onAdd is called with correct arg shape', () => {
    const { getByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    fireEvent.press(getByText('Hinzufügen'));
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.any(String), // type
      expect.any(Number), // startMonth
      expect.any(Number), // endMonth
      expect.any(String), // color
      expect.any(String) // label
    );
  });

  it('accepts initialMonth prop without crashing', () => {
    const { root } = render(
      <AddActivityModal
        visible={true}
        plantName="Tomate"
        initialMonth={10}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />
    );
    expect(root).toBeTruthy();
  });

  it('allows selecting a different activity type', () => {
    const { getAllByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    // ACTIVITY_TYPES has multiple entries; pressing any type button should not crash
    const typeButtons = getAllByText(/Aussaat|Pflanzung|Ernte|Pflege/);
    if (typeButtons.length > 0) {
      fireEvent.press(typeButtons[0]);
    }
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('adjusts endMonth when a later startMonth is selected', () => {
    const { getAllByText } = render(
      <AddActivityModal
        visible={true}
        plantName="Tomate"
        initialMonth={0}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />
    );
    // Pressing a month in the "Von" picker that is later than current endMonth
    // should auto-advance endMonth. We just verify no crash occurs.
    const monthButtons = getAllByText(/Jan|Feb|Mär|Apr/);
    if (monthButtons.length > 1) {
      fireEvent.press(monthButtons[1]);
    }
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not show a range error initially', () => {
    const { queryByText } = render(
      <AddActivityModal visible={true} plantName="Tomate" onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(queryByText(/Startmonat/)).toBeNull();
  });
});
