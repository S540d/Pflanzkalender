import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useTheme } from './src/hooks/useTheme';
import { PlantProvider } from './src/contexts/PlantContext';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.textSecondary,
          }}
        >
          <Tab.Screen
            name="Kalender"
            component={CalendarScreen}
            options={{
              tabBarLabel: 'Kalender',
              tabBarIcon: () => null,
            }}
          />
          <Tab.Screen
            name="Einstellungen"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Einstellungen',
              tabBarIcon: () => null,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <PlantProvider>
      <AppContent />
    </PlantProvider>
  );
}
