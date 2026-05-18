import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { storageService } from '../services/storage';
import { useLanguage, PICKER_LANGUAGES } from '../contexts/LanguageContext';

const APP_VERSION = '1.3.0';

export const SettingsScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleExport = async () => {
    try {
      await storageService.exportPlants();
      Alert.alert(t('settings.successTitle') as string, t('settings.exportSuccess') as string);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.settingsTitle, { color: theme.text }]}>
          {t('settings.settings') as string}
        </Text>

        {/* Appearance Settings - Dark/System Only */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.appearance') as string}
          </Text>
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
                {t('settings.dark') as string}
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
                {t('settings.system') as string}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.languageSection') as string}
          </Text>
          <View style={styles.languageGrid}>
            {PICKER_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langButton,
                  {
                    backgroundColor: language === lang.code ? '#6200EE' : theme.border,
                  },
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      color: language === lang.code ? '#fff' : theme.text,
                    },
                  ]}
                >
                  {lang.nativeLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Export Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.exportSection') as string}
          </Text>
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
              {t('settings.exportData') as string}
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
            <Text style={[styles.linkText, { color: '#6200EE' }]}>
              {t('settings.feedbackLink') as string}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItemFlex}
            onPress={() => Linking.openURL('https://ko-fi.com/devsven')}
          >
            <Text style={[styles.linkText, { color: '#6200EE' }]}>
              {t('settings.supportLink') as string}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.about2') as string}
          </Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {t('settings.versionLabel') as string} {APP_VERSION}
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

  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  langButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
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
