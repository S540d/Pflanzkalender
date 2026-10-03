import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityCompletionModal } from '../../src/components/ActivityCompletionModal';

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ddd',
      surface: '#f5f5f5',
      surfaceElevated: '#fff',
      overlay: 'rgba(0,0,0,0.4)',
      primary: '#4CAF50',
      error: '#f44336',
    },
  }),
}));

jest.mock('../../src/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'de',
    t: (key: string) => key,
  }),
}));

const baseProps = {
  visible: true,
  plantName: 'Tomaten',
  activityLabel: 'Aussäen',
  year: 2026,
  onSave: jest.fn(),
  onRemove: jest.fn(),
  onClose: jest.fn(),
};

describe('ActivityCompletionModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('übernimmt Datum und Notiz eines bestehenden Eintrags', async () => {
    const { getByTestId } = await render(
      <ActivityCompletionModal
        {...baseProps}
        completion={{ date: '2026-03-15', note: 'Sorte Rot' }}
      />
    );
    expect(getByTestId('completion-date-input').props.value).toBe('2026-03-15');
    expect(getByTestId('completion-note-input').props.value).toBe('Sorte Rot');
  });

  it('speichert gültige Eingaben (Notiz getrimmt, leer → weggelassen)', async () => {
    const { getByTestId } = await render(
      <ActivityCompletionModal {...baseProps} completion={{ date: '2026-03-15' }} />
    );
    await fireEvent.changeText(getByTestId('completion-date-input'), '2026-04-01');
    await fireEvent.changeText(getByTestId('completion-note-input'), '  gut  ');
    await fireEvent.press(getByTestId('completion-save'));
    expect(baseProps.onSave).toHaveBeenCalledWith({ date: '2026-04-01', note: 'gut' });

    baseProps.onSave.mockClear();
    await fireEvent.changeText(getByTestId('completion-note-input'), '   ');
    await fireEvent.press(getByTestId('completion-save'));
    expect(baseProps.onSave).toHaveBeenCalledWith({ date: '2026-04-01' });
  });

  it('blockiert ungültige Daten und zeigt eine Fehlermeldung', async () => {
    const { getByTestId, getByText } = await render(
      <ActivityCompletionModal {...baseProps} completion={undefined} />
    );
    await fireEvent.changeText(getByTestId('completion-date-input'), '2026-02-30');
    await fireEvent.press(getByTestId('completion-save'));
    expect(baseProps.onSave).not.toHaveBeenCalled();
    expect(getByText('completion.invalidDate')).toBeTruthy();
  });

  it('zeigt „Entfernen" nur bei bestehendem Eintrag', async () => {
    const withEntry = await render(
      <ActivityCompletionModal {...baseProps} completion={{ date: '2026-03-15' }} />
    );
    await fireEvent.press(withEntry.getByTestId('completion-remove'));
    expect(baseProps.onRemove).toHaveBeenCalled();

    const without = await render(<ActivityCompletionModal {...baseProps} completion={undefined} />);
    expect(without.queryByTestId('completion-remove')).toBeNull();
  });
});
