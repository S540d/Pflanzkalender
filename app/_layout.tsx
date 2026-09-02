import React from 'react';
import type { ColorValue } from 'react-native';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { LanguageProvider, useLanguage } from '../src/contexts/LanguageContext';
import { PlantProvider } from '../src/contexts/PlantContext';
import { useTheme } from '../src/hooks/useTheme';
import { Icon, type IconName } from '../src/components/ui';
import { shadow } from '../src/constants/designTokens';

function TabBarIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: ColorValue;
  focused: boolean;
}) {
  return <Icon name={name} size={focused ? 26 : 23} color={color} />;
}

function TabBarLabel({ label, color }: { label: string; color: ColorValue }) {
  return (
    <Text
      style={{ fontSize: 11, fontWeight: '600', color }}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
    >
      {label}
    </Text>
  );
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
            backgroundColor: theme.surfaceElevated,
            borderTopColor: theme.border,
            height: 62,
            paddingTop: 6,
            paddingBottom: 8,
            ...shadow(2),
          },
          tabBarLabel: ({ color, children }) => <TabBarLabel label={children} color={color} />,
          tabBarItemStyle: {
            paddingTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: isDe ? 'Kalender' : 'Calendar',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="calendar" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: 'Agenda',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="agenda" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="plants"
          options={{
            title: isDe ? 'Pflanzen' : 'Plants',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="plant" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="climate"
          options={{
            title: isDe ? 'Klima' : 'Climate',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="climate" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="templates"
          options={{
            title: isDe ? 'Vorlagen' : 'Templates',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="templates" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: isDe ? 'Einstellungen' : 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="settings" color={color} focused={focused} />
            ),
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
