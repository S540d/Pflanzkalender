import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { LanguageProvider, useLanguage } from '../src/contexts/LanguageContext';
import { PlantProvider } from '../src/contexts/PlantContext';
import { useTheme } from '../src/hooks/useTheme';

function TabBarIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
}

function TabsNavigator() {
  const { language } = useLanguage();
  const { theme, isDark } = useTheme();
  const isDe = language === 'de';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: isDe ? 'Kalender' : 'Calendar',
            tabBarIcon: ({ color }) => <TabBarIcon emoji="📅" color={color} />,
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: 'Agenda',
            tabBarIcon: ({ color }) => <TabBarIcon emoji="📋" color={color} />,
          }}
        />
        <Tabs.Screen
          name="plants"
          options={{
            title: isDe ? 'Pflanzen' : 'Plants',
            tabBarIcon: ({ color }) => <TabBarIcon emoji="🌱" color={color} />,
          }}
        />
        <Tabs.Screen
          name="climate"
          options={{
            title: isDe ? 'Klima' : 'Climate',
            tabBarIcon: ({ color }) => <TabBarIcon emoji="🌍" color={color} />,
          }}
        />
        <Tabs.Screen
          name="templates"
          options={{
            title: isDe ? 'Vorlagen' : 'Templates',
            tabBarIcon: ({ color }) => <TabBarIcon emoji="📄" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: isDe ? 'Einstellungen' : 'Settings',
            tabBarIcon: ({ color }) => <TabBarIcon emoji="⋮" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <LanguageProvider>
          <PlantProvider>
            <TabsNavigator />
          </PlantProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
