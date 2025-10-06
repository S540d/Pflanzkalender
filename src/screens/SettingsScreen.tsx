import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { resetToDefaults } = usePlants();
  const [useSystemTheme, setUseSystemTheme] = useState(false);

  const handleSupport = () => {
    Linking.openURL('https://buymeacoffee.com/sven4321');
  };

  const handleFeedback = () => {
    Linking.openURL('mailto:devsven@posteo.de?subject=Feedback zu Pflanzkalender');
  };

  const handleReset = () => {
    if (confirm('Möchtest du wirklich alle Daten zurücksetzen?')) {
      resetToDefaults();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Darstellung */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Darstellung</Text>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                disabled={useSystemTheme}
              />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <Text style={[styles.label, { color: theme.text }]}>System-Theme verwenden</Text>
              <Switch
                value={useSystemTheme}
                onValueChange={setUseSystemTheme}
              />
            </View>
          </View>
        </View>

        {/* Daten */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Daten</Text>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              Deine Daten werden lokal auf diesem Gerät gespeichert.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.border }]}
            onPress={handleReset}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Auf Standard zurücksetzen</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.border }]}
            onPress={handleFeedback}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Feedback senden</Text>
          </TouchableOpacity>
        </View>

        {/* Über & Lizenzen */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Über</Text>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.value, { color: theme.text }]}>Pflanzkalender</Text>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>Version 1.0.0</Text>
            <Text style={[styles.hint, { color: theme.textSecondary, marginTop: 8 }]}>
              Kontakt: devsven@posteo.de
            </Text>
          </View>
        </View>

        {/* Lizenzen */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Lizenzen</Text>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.label, { color: theme.text }]}>Open Source</Text>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              Diese App ist Open Source und steht unter der MIT Lizenz.
            </Text>
            <Text style={[styles.hint, { color: theme.textSecondary, marginTop: 8 }]}>
              Kommerzielle Nutzung ist ausgeschlossen.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.label, { color: theme.text }]}>Verwendete Bibliotheken</Text>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              • React Native & Expo{'\n'}
              • React Navigation{'\n'}
              • AsyncStorage
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
