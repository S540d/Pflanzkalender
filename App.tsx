import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { AgendaScreen } from './src/screens/AgendaScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useTheme } from './src/hooks/useTheme';
import { PlantProvider } from './src/contexts/PlantContext';

const Stack = createStackNavigator();

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Kalender"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Kalender" component={CalendarScreen} />
          <Stack.Screen name="Agenda" component={AgendaScreen} />
          <Stack.Screen name="Einstellungen" component={SettingsScreen} />
        </Stack.Navigator>
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
