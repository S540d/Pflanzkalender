import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';

interface AppHeaderProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ leftContent, rightContent }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const currentRoute = route.name;

  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.leftSection}>
        {leftContent}
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              currentRoute === 'Kalender' && { borderBottomWidth: 2, borderBottomColor: theme.primary }
            ]}
            onPress={() => navigation.navigate('Kalender' as never)}
          >
            <Text style={[
              styles.tabText,
              { color: currentRoute === 'Kalender' ? theme.primary : theme.textSecondary }
            ]}>
              Kalender
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              currentRoute === 'Agenda' && { borderBottomWidth: 2, borderBottomColor: theme.primary }
            ]}
            onPress={() => navigation.navigate('Agenda' as never)}
          >
            <Text style={[
              styles.tabText,
              { color: currentRoute === 'Agenda' ? theme.primary : theme.textSecondary }
            ]}>
              Agenda
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rightSection}>
        {rightContent}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Einstellungen' as never)}
        >
          <View style={styles.settingsIcon}>
            <View style={[styles.gear, { borderColor: theme.text }]} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 24,
    height: '100%',
  },
  tabButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gear: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
  },
});
