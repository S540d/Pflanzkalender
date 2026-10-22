import React from 'react';
import { Alert, Platform, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DialogProvider, useDialog, type DialogButton } from '../../src/contexts/DialogContext';

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      text: '#000',
      textSecondary: '#666',
      border: '#ddd',
      primary: '#4CAF50',
      onPrimary: '#fff',
      error: '#f44336',
      overlay: 'rgba(0,0,0,0.5)',
      surfaceElevated: '#fff',
    },
  }),
}));

const Trigger: React.FC<{ buttons?: DialogButton[]; message?: string }> = ({
  buttons,
  message,
}) => {
  const { alert } = useDialog();
  return (
    <TouchableOpacity testID="open" onPress={() => alert('Titel', message, buttons)}>
      <Text>open</Text>
    </TouchableOpacity>
  );
};

describe('DialogContext', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('nutzt nativ Alert.alert', async () => {
    const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByTestId } = await render(
      <DialogProvider>
        <Trigger message="Text" />
      </DialogProvider>
    );
    await fireEvent.press(getByTestId('open'));
    expect(spy).toHaveBeenCalledWith('Titel', 'Text');
  });

  it('fällt ohne Provider auf Alert.alert zurück', async () => {
    const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByTestId } = await render(<Trigger />);
    await fireEvent.press(getByTestId('open'));
    expect(spy).toHaveBeenCalled();
  });

  describe('im Web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    it('zeigt Titel, Text und Buttons und ruft onPress des gewählten Buttons', async () => {
      const onCancel = jest.fn();
      const onDelete = jest.fn();
      const { getByTestId, getByText, queryByText } = await render(
        <DialogProvider>
          <Trigger
            message="Wirklich löschen?"
            buttons={[
              { text: 'Abbrechen', style: 'cancel', onPress: onCancel },
              { text: 'Löschen', style: 'destructive', onPress: onDelete },
            ]}
          />
        </DialogProvider>
      );

      await fireEvent.press(getByTestId('open'));
      expect(getByText('Titel')).toBeTruthy();
      expect(getByText('Wirklich löschen?')).toBeTruthy();

      await fireEvent.press(getByText('Löschen'));
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onCancel).not.toHaveBeenCalled();
      await waitFor(() => expect(queryByText('Titel')).toBeNull());
    });

    it('Tippen auf den Hintergrund wählt „Abbrechen"', async () => {
      const onCancel = jest.fn();
      const onDelete = jest.fn();
      const { getByTestId, queryByText } = await render(
        <DialogProvider>
          <Trigger
            buttons={[
              { text: 'Abbrechen', style: 'cancel', onPress: onCancel },
              { text: 'Löschen', style: 'destructive', onPress: onDelete },
            ]}
          />
        </DialogProvider>
      );

      await fireEvent.press(getByTestId('open'));
      await fireEvent.press(getByTestId('dialog-backdrop'));

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onDelete).not.toHaveBeenCalled();
      await waitFor(() => expect(queryByText('Titel')).toBeNull());
    });

    it('ohne Buttons gibt es einen OK-Button', async () => {
      const { getByTestId, getByText, queryByText } = await render(
        <DialogProvider>
          <Trigger />
        </DialogProvider>
      );
      await fireEvent.press(getByTestId('open'));
      await fireEvent.press(getByText('OK'));
      await waitFor(() => expect(queryByText('Titel')).toBeNull());
    });

    it('erlaubt einen Folgedialog direkt aus onPress (Bestätigen → Erfolgsmeldung)', async () => {
      const Chain: React.FC = () => {
        const { alert } = useDialog();
        return (
          <TouchableOpacity
            testID="open"
            onPress={() =>
              alert('Frage', undefined, [
                { text: 'Ja', onPress: () => alert('Erledigt', 'Alles klar') },
              ])
            }
          >
            <Text>open</Text>
          </TouchableOpacity>
        );
      };
      const { getByTestId, getByText, queryByText } = await render(
        <DialogProvider>
          <Chain />
        </DialogProvider>
      );

      await fireEvent.press(getByTestId('open'));
      await fireEvent.press(getByText('Ja'));

      expect(await waitFor(() => getByText('Erledigt'))).toBeTruthy();
      expect(queryByText('Frage')).toBeNull();
    });
  });
});
