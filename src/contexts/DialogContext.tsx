import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, shadow, spacing, typography } from '../constants/designTokens';
import { useTheme } from '../hooks/useTheme';

export interface DialogButton {
  text?: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

type ShowDialog = (title: string, message?: string, buttons?: DialogButton[]) => void;

interface DialogContextType {
  /** Gleiche Signatur wie `Alert.alert`, funktioniert aber auch im Web. */
  alert: ShowDialog;
}

/** `Alert.alert` nur mit den tatsächlich gesetzten Argumenten aufrufen (wie bisher direkt im Code). */
const nativeAlert: ShowDialog = (title, message, buttons) => {
  if (buttons) Alert.alert(title, message, buttons);
  else if (message !== undefined) Alert.alert(title, message);
  else Alert.alert(title);
};

// Ohne Provider (z. B. in Tests) fällt `alert` auf `Alert.alert` zurück.
const DialogContext = createContext<DialogContextType>({ alert: nativeAlert });

interface DialogState {
  title: string;
  message?: string;
  buttons: DialogButton[];
}

/**
 * `Alert.alert` ist in React Native Web ein No-Op – Bestätigungen (Löschen, Import) und
 * Meldungen würden im Web (PWA/TWA) nie erscheinen. Im Web rendert dieser Provider deshalb
 * einen eigenen Dialog; nativ wird weiter `Alert.alert` genutzt. Neue Dialoge immer über
 * `useDialog().alert(...)` statt `Alert.alert` aufrufen.
 */
export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const alert = useCallback<ShowDialog>((title, message, buttons) => {
    if (Platform.OS !== 'web') {
      nativeAlert(title, message, buttons);
      return;
    }
    setDialog({ title, message, buttons: buttons?.length ? buttons : [{ text: 'OK' }] });
  }, []);

  const value = useMemo(() => ({ alert }), [alert]);

  const press = (button: DialogButton) => {
    // Erst schließen, dann ausführen: onPress darf direkt einen Folgedialog öffnen.
    setDialog(null);
    button.onPress?.();
  };

  const cancelButton = dialog?.buttons.find((b) => b.style === 'cancel');

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog && (
        <WebDialog
          dialog={dialog}
          onPress={press}
          onDismiss={() => (cancelButton ? press(cancelButton) : setDialog(null))}
        />
      )}
    </DialogContext.Provider>
  );
};

const WebDialog: React.FC<{
  dialog: DialogState;
  onPress: (button: DialogButton) => void;
  onDismiss: () => void;
}> = ({ dialog, onPress, onDismiss }) => {
  const { theme } = useTheme();

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable
        testID="dialog-backdrop"
        style={[styles.overlay, { backgroundColor: theme.overlay }]}
        onPress={onDismiss}
      >
        {/* Eigener Pressable, damit Tipps in die Karte den Dialog nicht schließen. */}
        <Pressable
          accessibilityRole="alert"
          style={[styles.card, { backgroundColor: theme.surfaceElevated }, shadow(3)]}
        >
          <Text style={[styles.title, { color: theme.text }]}>{dialog.title}</Text>
          {!!dialog.message && (
            <Text style={[styles.message, { color: theme.textSecondary }]}>{dialog.message}</Text>
          )}
          <View style={styles.buttons}>
            {dialog.buttons.map((button, index) => {
              const destructive = button.style === 'destructive';
              const cancel = button.style === 'cancel';
              return (
                <Pressable
                  key={`${button.text}-${index}`}
                  testID={`dialog-button-${index}`}
                  accessibilityRole="button"
                  onPress={() => onPress(button)}
                  style={[
                    styles.button,
                    cancel
                      ? { borderColor: theme.border, borderWidth: 1.5 }
                      : { backgroundColor: destructive ? theme.error : theme.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: cancel ? theme.text : destructive ? '#FFFFFF' : theme.onPrimary },
                    ]}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const useDialog = (): DialogContextType => useContext(DialogContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
  },
  message: {
    ...typography.bodySm,
  },
  buttons: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.bodyStrong,
  },
});
