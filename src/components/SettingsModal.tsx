import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { sharePlants, importFromJson } from '../services/templateService';
import { useLanguage, PICKER_LANGUAGES } from '../contexts/LanguageContext';
import { usePlants } from '../contexts/PlantContext';
import packageJson from '../../package.json';
import { Button, Card, Icon } from './ui';
import { radius, spacing } from '../constants/designTokens';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const APP_VERSION = packageJson.version;

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { plants, replacePlants, appendPlants } = usePlants();

  const handleExport = async () => {
    try {
      await sharePlants(plants);
      if (Platform.OS !== 'web') {
        Alert.alert(t('settings.successTitle') as string, t('settings.exportSuccess') as string);
      }
    } catch (error) {
      Alert.alert(t('template.errorTitle') as string, t('settings.exportError') as string);
      console.error('Export error:', error);
    }
  };

  const handleImport = () => {
    if (Platform.OS !== 'web') {
      Alert.alert(t('settings.importData') as string, t('settings.importWebOnly') as string);
      return;
    }
    // platform-safe: document only available in web context
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = importFromJson(text);
        const normalised = imported.map((p) => ({ ...p, isDefault: false }));
        const msg = (t('settings.importConfirmMessage') as string).replace(
          '{count}',
          String(normalised.length)
        );
        Alert.alert(t('settings.importConfirmTitle') as string, msg, [
          { text: t('settings.importConfirmCancel') as string, style: 'cancel' },
          {
            text: t('settings.importConfirmAppend') as string,
            onPress: () => {
              appendPlants(normalised);
              const successMsg = (t('settings.importSuccess') as string).replace(
                '{count}',
                String(normalised.length)
              );
              Alert.alert(t('settings.successTitle') as string, successMsg);
            },
          },
          {
            text: t('settings.importConfirmOk') as string,
            onPress: () => {
              replacePlants(normalised);
              const successMsg = (t('settings.importSuccess') as string).replace(
                '{count}',
                String(normalised.length)
              );
              Alert.alert(t('settings.successTitle') as string, successMsg);
            },
          },
        ]);
      } catch (error) {
        Alert.alert(t('settings.importData') as string, t('settings.importError') as string);
        console.error('Import error:', error);
      }
      (e.target as HTMLInputElement).value = '';
    };
    input.click();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.surfaceElevated, borderBottomColor: theme.border },
          ]}
        >
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {t('settings.settings') as string}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: theme.surface }]}
            accessibilityRole="button"
            accessibilityLabel={t('settings.close') as string}
          >
            <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '700' }}>
              {t('settings.close') as string}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Appearance Settings - Dark/System Only */}
          <Card elevation={1} padding={spacing.lg} style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Icon name="theme" size={16} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {t('settings.appearance') as string}
              </Text>
            </View>
            <View style={styles.themeToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: themeMode === 'dark' ? theme.primary : theme.surface,
                    borderColor: theme.border,
                    flex: 1,
                  },
                ]}
                onPress={() => setThemeMode('dark')}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    { color: themeMode === 'dark' ? '#fff' : theme.text },
                  ]}
                >
                  {t('settings.dark') as string}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: themeMode === 'system' ? theme.primary : theme.surface,
                    borderColor: theme.border,
                    flex: 1,
                  },
                ]}
                onPress={() => setThemeMode('system')}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    { color: themeMode === 'system' ? '#fff' : theme.text },
                  ]}
                >
                  {t('settings.system') as string}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Language Settings */}
          <Card elevation={1} padding={spacing.lg} style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Icon name="language" size={16} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {t('settings.languageSection') as string}
              </Text>
            </View>
            <View style={styles.languageGrid}>
              {PICKER_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langButton,
                    {
                      backgroundColor: language === lang.code ? theme.primary : theme.surface,
                      borderColor: language === lang.code ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      { color: language === lang.code ? '#fff' : theme.text },
                    ]}
                  >
                    {lang.nativeLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Export / Import Section */}
          <Card elevation={1} padding={spacing.lg} style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Icon name="share" size={16} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {t('settings.exportSection') as string}
              </Text>
            </View>
            <Button
              label={t('settings.exportData') as string}
              icon="download"
              fullWidth
              onPress={handleExport}
              style={styles.dataButton}
            />
            <Text style={[styles.sectionTitle, styles.importTitle, { color: theme.textSecondary }]}>
              {t('settings.importSection') as string}
            </Text>
            <Button
              label={t('settings.importData') as string}
              icon="upload"
              variant="secondary"
              fullWidth
              onPress={handleImport}
            />
          </Card>

          {/* Feedback and Support in One Row */}
          <View style={[styles.section, styles.sectionRow]}>
            <TouchableOpacity
              style={styles.linkItemFlex}
              onPress={() => {
                Linking.openURL('mailto:feedback@example.com');
              }}
            >
              <Text style={[styles.linkText, { color: theme.primary }]}>
                {t('settings.feedbackLink') as string}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkItemFlex}
              onPress={() => Linking.openURL('https://ko-fi.com/devsven')}
            >
              <Text style={[styles.linkText, { color: theme.primary }]}>
                {t('settings.supportLink') as string}
              </Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              {t('settings.about2') as string}
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {t('settings.versionLabel') as string} {APP_VERSION}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: spacing.md,
  },

  card: {
    marginBottom: 0,
  },

  section: {
    paddingVertical: 12,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  themeToggleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
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
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },

  dataButton: {
    marginBottom: spacing.md,
  },
  importTitle: {
    marginBottom: spacing.sm,
  },

  linkText: {
    fontSize: 14,
    fontWeight: '600',
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
});
