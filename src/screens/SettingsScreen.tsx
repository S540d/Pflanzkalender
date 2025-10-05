import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleSupport = () => {
    Linking.openURL('https://buymeacoffee.com/sven4321');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Einstellungen</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Konto</Text>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Status</Text>
          <Text style={[styles.value, { color: theme.text }]}>Testzugang (Lokal)</Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Deine Daten werden nur auf diesem Gerät gespeichert.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => alert('Google Anmeldung wird implementiert')}
        >
          <Text style={styles.buttonText}>Mit Google anmelden</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Über</Text>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.value, { color: theme.text }]}>Pflanzkalender PWA</Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>Version 1.0.0</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={handleSupport}
        >
          <Text style={styles.buttonText}>☕ Unterstütze diese App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
