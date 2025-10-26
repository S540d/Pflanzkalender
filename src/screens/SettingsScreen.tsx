import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Switch, Share } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePlants } from '../contexts/PlantContext';
import { useLanguage } from '../contexts/LanguageContext';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const { plants, resetToDefaults, deletePlant } = usePlants();
  const { language, setLanguage, t } = useLanguage();

  const handleFeedback = () => {
    Linking.openURL('mailto:devsven@posteo.de?subject=Feedback zu Pflanzkalender');
  };

  const handleSupportPress = () => {
    Linking.openURL('https://buymeacoffee.com/sven4321');
  };

  const handleLanguageToggle = (value: boolean) => {
    setLanguage(value ? 'en' : 'de');
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

  const handleExportData = async () => {
    try {
      const exportData = {
        plants,
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0'
      };
      
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: 'Pflanzkalender Daten Export'
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleThemeToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'system');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.appName, { color: theme.text }]}>{t('settings.title')}</Text>

        <View style={styles.settingsOption}>
          <Text style={[styles.label, { color: theme.text }]}>{t('settings.theme')}</Text>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={handleThemeToggle}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.surface}
          />
        </View>

        <View style={styles.settingsOption}>
          <Text style={[styles.label, { color: theme.text }]}>{t('settings.language')}</Text>
          <Switch
            value={language === 'en'}
            onValueChange={handleLanguageToggle}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.surface}
          />
        </View>

        <TouchableOpacity style={[styles.exportButton, { backgroundColor: theme.border }]} onPress={handleExportData}>
          <Text style={[styles.exportButtonText, { color: theme.text }]}>{t('settings.export')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.supportButton, { backgroundColor: '#FFD700' }]} onPress={handleSupportPress}>
          <Text style={styles.supportButtonText}>{t('settings.support')}</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <Text style={[styles.feedbackText, { color: theme.textSecondary }]}>{t('settings.feedback')}</Text>
        <TouchableOpacity onPress={handleFeedback}>
          <Text style={[styles.feedbackEmail, { color: theme.primary }]}>devsven@posteo.de</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>{t('settings.about')}</Text>
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>{t('settings.version')} • {new Date().getFullYear()}</Text>

        <View style={styles.spacer} />

        <Text style={[styles.licenseText, { color: theme.textSecondary }]}>{t('settings.license')}</Text>
        <Text style={[styles.licenseDetails, { color: theme.textSecondary }]}>
          {t('settings.licenseDetails')}
        </Text>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  
  // New compact settings styles
  appName: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 24,
    textAlign: 'center'
  },
  
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  
  label: { 
    fontSize: 15,
    fontWeight: '500'
  },
  
  exportButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },

  exportButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },

  supportButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  
  spacer: {
    height: 20
  },
  
  feedbackText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  feedbackEmail: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  
  aboutText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  versionText: {
    fontSize: 12,
    marginBottom: 8,
  },
  
  licenseText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  licenseDetails: {
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Metrics styles
  metricsCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  metricsLabel: {
    fontSize: 14,
  },
  
  metricsValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Legacy styles (keeping for compatibility)
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  card: { padding: 16, borderRadius: 8, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  hint: { fontSize: 12, lineHeight: 18 },
  button: { padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  plantList: { marginTop: 8 },
  plantListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  plantListItemLast: { borderBottomWidth: 0 },
  plantInfo: { flex: 1, marginRight: 12 },
  plantName: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  plantNotes: { fontSize: 12, lineHeight: 16 },
  deleteIcon: { padding: 8 },
  deleteIconText: { fontSize: 18 },
});
