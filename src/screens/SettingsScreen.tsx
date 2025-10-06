import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Switch, Modal } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { plants, resetToDefaults, deletePlant } = usePlants();
  const navigation = useNavigation();
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

  const handleDeletePlant = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant && confirm(`Möchtest du "${plant.name}" wirklich löschen?`)) {
      deletePlant(plantId);
    }
  };

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Einstellungen</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollContent}>
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

        {/* Pflanzen verwalten */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pflanzen verwalten</Text>

          {plants.map(plant => (
            <View key={plant.id} style={[styles.plantRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.plantRowText, { color: theme.text }]}>{plant.name}</Text>
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#EF5350' }]}
                onPress={() => handleDeletePlant(plant.id)}
              >
                <Text style={styles.deleteButtonText}>Löschen</Text>
              </TouchableOpacity>
            </View>
          ))}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  scrollContent: {
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
  plantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  plantRowText: {
    fontSize: 14,
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
