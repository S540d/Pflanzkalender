import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const APP_VERSION = '1.0.0';

export const SettingsScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.settingsTitle, { color: theme.text }]}>Settings</Text>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
          <View style={styles.themeToggleContainer}>
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: themeMode === mode ? '#6200EE' : theme.border,
                    flex: 1,
                  },
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      color: themeMode === mode ? '#fff' : theme.text,
                    },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Feedback */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('mailto:feedback@example.com');
            }}
          >
            <Text style={[styles.linkText, { color: '#6200EE' }]}>Send Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Version {APP_VERSION}
          </Text>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Support */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://buymeacoffee.com/sven4321')}
          >
            <Text style={[styles.linkText, { color: '#6200EE' }]}>Buy Me a Coffee</Text>
          </TouchableOpacity>
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

  infoText: {
    fontSize: 13,
    marginTop: 4,
  },
});
