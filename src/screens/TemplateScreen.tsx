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
import { Plant } from '../types';

type Section = 'templates' | 'export' | 'import';

export const TemplateScreen: React.FC = () => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const { plants, addPlant } = usePlants();
  const isDe = language === 'de';

  const [activeSection, setActiveSection] = useState<Section>('templates');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const styles = makeStyles();

  const handleImportTemplate = (templateId: string) => {
    const template = COMMUNITY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    template.plants.forEach((plant) => {
      addPlant(plant);
    });

    const name = isDe ? template.name.de : template.name.en;
    Alert.alert(
      isDe ? 'Importiert!' : 'Imported!',
      isDe
        ? `${template.plants.length} Pflanzen aus "${name}" wurden hinzugefügt.`
        : `${template.plants.length} plants from "${name}" have been added.`
    );
  };

  const handleExport = async () => {
    if (plants.length === 0) {
      Alert.alert(
        isDe ? 'Keine Pflanzen' : 'No plants',
        isDe
          ? 'Es sind keine Pflanzen zum Exportieren vorhanden.'
          : 'There are no plants to export.'
      );
      return;
    }
    setExporting(true);
    try {
      await sharePlants(plants);
      if (Platform.OS !== 'web') {
        Alert.alert(
          isDe ? 'Erfolg' : 'Success',
          isDe ? 'Export erfolgreich!' : 'Export successful!'
        );
      }
    } catch {
      Alert.alert(isDe ? 'Fehler' : 'Error', isDe ? 'Export fehlgeschlagen.' : 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const handleImportJson = async () => {
    if (!importText.trim()) {
      Alert.alert(
        isDe ? 'Hinweis' : 'Note',
        isDe ? 'Bitte JSON-Daten einfügen.' : 'Please paste JSON data.'
      );
      return;
    }
    setImporting(true);
    try {
      const imported: Plant[] = importFromJson(importText.trim());
      imported.forEach(({ id: _id, createdAt: _c, updatedAt: _u, ...plant }) => {
        addPlant(plant);
      });
      setImportText('');
      Alert.alert(
        isDe ? 'Erfolg' : 'Success',
        isDe
          ? `${imported.length} Pflanze(n) wurden importiert.`
          : `${imported.length} plant(s) have been imported.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert(isDe ? 'Fehler' : 'Error', msg);
    } finally {
      setImporting(false);
    }
  };

  const handleChooseFile = () => {
    if (Platform.OS !== 'web') return;
    // platform-safe: document only available in web context
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
    if (section === 'templates') return isDe ? 'Vorlagen' : 'Templates';
    if (section === 'export') return isDe ? 'Exportieren' : 'Export';
    return isDe ? 'Importieren' : 'Import';
  };

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
                    {isDe ? tmpl.name.de : tmpl.name.en}
                  </Text>
                  <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                    {isDe ? tmpl.description.de : tmpl.description.en}
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
            <Text style={styles.actionBtnText}>
              {`📤 ${isDe ? 'Alle' : 'All'} ${plants.length} ${isDe ? 'Pflanzen exportieren' : 'plants export'}`}
            </Text>
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
            <Text style={styles.actionBtnText}>{`📥 ${isDe ? 'Importieren' : 'Import'}`}</Text>
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
