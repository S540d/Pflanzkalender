import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Platform, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { storageService } from '../services/storage';

const APP_VERSION = '1.0.0';

type Language = 'en' | 'de';

const translations = {
  en: {
    settings: 'Settings',
    appearance: 'APPEARANCE',
    dark: 'Dark',
    system: 'System',
    language: 'LANGUAGE',
    english: 'English',
    german: 'German',
    feedback: 'Send Feedback',
    support: 'Buy Me a Coffee',
    export: 'EXPORT',
    exportData: 'Export as JSON',
    about: 'ABOUT',
    version: 'Version',
    exportSuccess: 'Export successful!',
  },
  de: {
    settings: 'Einstellungen',
    appearance: 'ERSCHEINUNGSBILD',
    dark: 'Dunkel',
    system: 'System',
    language: 'SPRACHE',
    english: 'English',
    german: 'Deutsch',
    feedback: 'Feedback senden',
    support: 'Buy Me a Coffee',
    export: 'EXPORTIEREN',
    exportData: 'Als JSON exportieren',
    about: 'ÜBER',
    version: 'Version',
    exportSuccess: 'Export erfolgreich!',
  },
};

export const SettingsScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  const handleExport = async () => {
    try {
      await storageService.exportPlants();
      Alert.alert('Success', t.exportSuccess);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.settingsTitle, { color: theme.text }]}>{t.settings}</Text>

        {/* Appearance Settings - Dark/System Only */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t.appearance}</Text>
          <View style={styles.themeToggleContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor: themeMode === 'dark' ? '#6200EE' : theme.border,
                  flex: 1,
                },
              ]}
              onPress={() => setThemeMode('dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: themeMode === 'dark' ? '#fff' : theme.text,
                  },
                ]}
              >
                {t.dark}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor: themeMode === 'system' ? '#6200EE' : theme.border,
                  flex: 1,
                },
              ]}
              onPress={() => setThemeMode('system')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: themeMode === 'system' ? '#fff' : theme.text,
                  },
                ]}
              >
                {t.system}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t.language}</Text>
          <View style={styles.themeToggleContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor: language === 'en' ? '#6200EE' : theme.border,
                  flex: 1,
                },
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: language === 'en' ? '#fff' : theme.text,
                  },
                ]}
              >
                {t.english}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor: language === 'de' ? '#6200EE' : theme.border,
                  flex: 1,
                },
              ]}
              onPress={() => setLanguage('de')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: language === 'de' ? '#fff' : theme.text,
                  },
                ]}
              >
                {t.german}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Export Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t.export}</Text>
          <TouchableOpacity
            style={[
              styles.exportButton,
              {
                backgroundColor: '#6200EE',
              },
            ]}
            onPress={handleExport}
          >
            <Text
              style={[
                styles.exportButtonText,
                {
                  color: '#fff',
                },
              ]}
            >
              {t.exportData}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Feedback and Support in One Row */}
        <View style={[styles.section, styles.sectionRow]}>
          <TouchableOpacity
            style={styles.linkItemFlex}
            onPress={() => {
              Linking.openURL('mailto:feedback@example.com');
            }}
          >
            <Text style={[styles.linkText, { color: '#6200EE' }]}>{t.feedback}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItemFlex}
            onPress={() => Linking.openURL('https://buymeacoffee.com/sven4321')}
          >
            <Text style={[styles.linkText, { color: '#6200EE' }]}>{t.support}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t.about}</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {t.version} {APP_VERSION}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },

  settingsTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },

  section: {
    paddingVertical: 12,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  themeToggleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },

  themeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  separator: {
    height: 1,
    marginVertical: 8,
  },

  linkText: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 12,
  },

  linkItemFlex: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  infoText: {
    fontSize: 13,
    marginTop: 4,
  },

  exportButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },

  exportButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
