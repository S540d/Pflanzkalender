import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { AgendaScreen } from './src/screens/AgendaScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useTheme } from './src/hooks/useTheme';
import { PlantProvider } from './src/contexts/PlantContext';

function AppContent() {
  const { isDark } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('Kalender');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Kalender':
        return <CalendarScreen />;
      case 'Agenda':
        return <AgendaScreen />;
      case 'Einstellungen':
        return <SettingsScreen />;
      default:
        return <CalendarScreen />;
    }
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header with Navigation */}
        <View style={{ padding: 20, backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
            Pflanzkalender
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setCurrentScreen('Kalender')}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: currentScreen === 'Kalender' ? 'rgba(255,255,255,0.3)' : 'transparent',
                borderRadius: 15,
              }}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>📅</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentScreen('Agenda')}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: currentScreen === 'Agenda' ? 'rgba(255,255,255,0.3)' : 'transparent',
                borderRadius: 15,
              }}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>📋</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentScreen('Einstellungen')}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: currentScreen === 'Einstellungen' ? 'rgba(255,255,255,0.3)' : 'transparent',
                borderRadius: 15,
              }}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Screen Content */}
        <View style={{ flex: 1 }}>
          {renderScreen()}
        </View>
      </View>
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
