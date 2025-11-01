import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.appName, { color: theme.text }]}>Settings</Text>

        <TouchableOpacity
          style={[styles.coffeeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => Linking.openURL('https://buymeacoffee.com/sven4321')}
        >
          <Text style={[styles.coffeeButtonText, { color: theme.text }]}>Buy Me a Coffee</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },

  appName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center'
  },

  coffeeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20,
  },

  coffeeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
