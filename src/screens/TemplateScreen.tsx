import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { usePlants } from '../contexts/PlantContext';
import { COMMUNITY_TEMPLATES } from '../constants/communityTemplates';
import { sharePlants, importFromJson } from '../services/templateService';

type Section = 'templates' | 'export' | 'import';

export const TemplateScreen: React.FC = () => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const { plants, replacePlants, appendPlants } = usePlants();

  const [activeSection, setActiveSection] = useState<Section>('templates');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const styles = makeStyles();

  const getTemplateLocale = (val: { de: string; en: string }) =>
    language === 'de' ? val.de : val.en;

  const handleImportTemplate = (templateId: string) => {
    const template = COMMUNITY_TEMPLATES.find((tmpl) => tmpl.id === templateId);
    if (!template) return;

    appendPlants(template.plants.map((p) => ({ ...p, isDefault: false })));

    const name = getTemplateLocale(template.name);
    Alert.alert(
      String(t('template.importedTitle')),
      String(t('template.importedMessage'))
        .replace('{count}', String(template.plants.length))
        .replace('{name}', name)
    );
  };

  const handleExport = async () => {
    if (plants.length === 0) {
      Alert.alert(String(t('template.noPlantsTitle')), String(t('template.noPlantsMessage')));
      return;
    }
    setExporting(true);
    try {
      await sharePlants(plants);
      if (Platform.OS !== 'web') {
        Alert.alert(String(t('settings.successTitle')), String(t('settings.exportSuccess')));
      }
    } catch {
      Alert.alert(String(t('template.errorTitle')), String(t('template.exportFailed')));
    } finally {
      setExporting(false);
    }
  };

  const handleImportJson = () => {
    if (!importText.trim()) {
      Alert.alert(String(t('template.noteTitle')), String(t('template.pastePlease')));
      return;
    }
    let imported: ReturnType<typeof importFromJson>;
    try {
      imported = importFromJson(importText.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert(String(t('template.errorTitle')), msg);
      return;
    }
    const normalised = imported.map((p) => ({ ...p, isDefault: false }));
    const msg = String(t('template.importModeMessage')).replace(
      '{count}',
      String(normalised.length)
    );
    // Do not set importing=true before the Alert: if the dialog is dismissed
    // without a button press (e.g. Android back), the button would stay disabled.
    Alert.alert(String(t('template.importModeTitle')), msg, [
      {
        text: String(t('common.cancel')),
        style: 'cancel',
      },
      {
        text: String(t('template.importModeAppend')),
        onPress: () => {
          setImporting(true);
          appendPlants(normalised);
          setImportText('');
          setImporting(false);
          const successMsg = String(t('settings.importSuccess')).replace(
            '{count}',
            String(normalised.length)
          );
          Alert.alert(String(t('settings.successTitle')), successMsg);
        },
      },
      {
        text: String(t('template.importModeReplace')),
        onPress: () => {
          setImporting(true);
          replacePlants(normalised);
          setImportText('');
          setImporting(false);
          const successMsg = String(t('settings.importSuccess')).replace(
            '{count}',
            String(normalised.length)
          );
          Alert.alert(String(t('settings.successTitle')), successMsg);
        },
      },
    ]);
  };

  const handleChooseFile = () => {
    if (Platform.OS !== 'web') return;
    // platform-safe: document can be undefined in SSR/test even when Platform.OS === 'web'
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (typeof text === 'string') setImportText(text);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const sectionLabel = (section: Section): string => {
    if (section === 'templates') return String(t('template.tabTemplates'));
    if (section === 'export') return String(t('template.tabExport'));
    return String(t('template.tabImport'));
  };

  const exportBtnLabel = String(t('template.exportBtn')).replace('{count}', String(plants.length));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{String(t('template.title'))}</Text>

      {/* Section switcher */}
      <View style={styles.tabRow}>
        {(['templates', 'export', 'import'] as Section[]).map((section) => (
          <TouchableOpacity
            key={section}
            style={[
              styles.tabBtn,
              { borderColor: theme.border },
              activeSection === section && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveSection(section)}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeSection === section ? '#fff' : theme.textSecondary },
              ]}
            >
              {sectionLabel(section)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Community Templates */}
      {activeSection === 'templates' && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
            {String(t('template.community'))}
          </Text>
          {COMMUNITY_TEMPLATES.map((tmpl) => (
            <View
              key={tmpl.id}
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{tmpl.icon}</Text>
                <View style={styles.cardTitleBlock}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {getTemplateLocale(tmpl.name)}
                  </Text>
                  <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                    {getTemplateLocale(tmpl.description)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardPlants, { color: theme.textSecondary }]}>
                {tmpl.plants.map((p) => p.name).join(' · ')}
              </Text>
              <TouchableOpacity
                style={[styles.importBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleImportTemplate(tmpl.id)}
              >
                <Text style={styles.importBtnText}>{String(t('template.importBtn'))}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Export */}
      {activeSection === 'export' && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
            {String(t('template.exportSection'))}
          </Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            {String(t('template.exportHint'))}
          </Text>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: theme.primary, opacity: exporting ? 0.6 : 1 },
            ]}
            onPress={handleExport}
            disabled={exporting}
          >
            <Text style={styles.actionBtnText}>{exportBtnLabel}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Import */}
      {activeSection === 'import' && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
            {String(t('template.importSection'))}
          </Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            {String(t('template.importHint'))}
          </Text>

          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.fileBtn, { borderColor: theme.border }]}
              onPress={handleChooseFile}
            >
              <Text style={[styles.fileBtnText, { color: theme.text }]}>
                {String(t('template.chooseFile'))}
              </Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={[
              styles.jsonInput,
              { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
            ]}
            multiline
            numberOfLines={8}
            placeholder={String(t('template.pasteJson'))}
            placeholderTextColor={theme.textSecondary}
            value={importText}
            onChangeText={setImportText}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: theme.primary, opacity: importing ? 0.6 : 1 },
            ]}
            onPress={handleImportJson}
            disabled={importing}
          >
            <Text style={styles.actionBtnText}>{`📥 ${String(t('template.tabImport'))}`}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      padding: 16,
      paddingBottom: 8,
    },
    tabRow: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginBottom: 12,
      gap: 8,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
    },
    tabBtnText: {
      fontSize: 13,
      fontWeight: '600',
    },
    section: {
      paddingHorizontal: 16,
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginBottom: 12,
      textTransform: 'uppercase',
    },
    card: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 14,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    cardIcon: {
      fontSize: 28,
      marginRight: 12,
      marginTop: 2,
    },
    cardTitleBlock: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    cardDesc: {
      fontSize: 13,
    },
    cardPlants: {
      fontSize: 12,
      marginBottom: 12,
    },
    importBtn: {
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
    },
    importBtnText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    hint: {
      fontSize: 14,
      marginBottom: 16,
      lineHeight: 20,
    },
    actionBtn: {
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4,
    },
    actionBtnText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 15,
    },
    fileBtn: {
      borderRadius: 8,
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    fileBtnText: {
      fontWeight: '600',
      fontSize: 14,
    },
    jsonInput: {
      borderRadius: 8,
      borderWidth: 1,
      padding: 12,
      fontSize: 13,
      minHeight: 140,
      marginBottom: 12,
      fontFamily: 'monospace',
    },
    spacer: {
      height: 40,
    },
  });
