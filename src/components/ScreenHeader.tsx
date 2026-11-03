import React, { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { spacing, typography } from '../constants/designTokens';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme';
import { SettingsModal } from './SettingsModal';
import { Icon } from './ui';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Großer Titel für den Startbildschirm. */
  large?: boolean;
}

/**
 * Einheitlicher Markenkopf (gleiches Design wie in Safe my plants): flächiges
 * Waldgrün, unten abgerundet, Serifentitel. Das ⋮ rechts öffnet die Einstellungen.
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, large }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  // Context statt useSafeAreaInsets(): funktioniert auch ohne Provider (Tests).
  const insets = useContext(SafeAreaInsetsContext);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.gradientStart, paddingTop: (insets?.top ?? 0) + spacing.lg },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text
            style={[large ? styles.titleLarge : styles.title, { color: theme.headerTitle }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {!!subtitle && (
            <Text style={[styles.subtitle, { color: theme.headerSubtitle }]}>{subtitle}</Text>
          )}
        </View>
        <Pressable
          onPress={() => setSettingsVisible(true)}
          hitSlop={12}
          style={styles.menuBtn}
          accessibilityRole="button"
          accessibilityLabel={language === 'de' ? 'Einstellungen' : 'Settings'}
          testID="header-settings-button"
        >
          <Icon name="settings" size={24} color={theme.headerTitle} />
        </Pressable>
      </View>
      {/* Erst bei Bedarf mounten – sonst hielte jeder Screen ein komplettes Settings-Modal vor. */}
      {settingsVisible && <SettingsModal visible onClose={() => setSettingsVisible(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    ...typography.h2,
  },
  titleLarge: {
    ...typography.h1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  menuBtn: {
    padding: spacing.xs,
  },
});
