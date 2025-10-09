import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { AgendaScreen } from './src/screens/AgendaScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Footer } from './src/components/Footer';
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
        <View style={{ padding: 20, backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
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
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <Circle cx="12" cy="5" r="2" />
                <Circle cx="12" cy="12" r="2" />
                <Circle cx="12" cy="19" r="2" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Screen Content */}
        <View style={{ flex: 1, paddingBottom: 60 }}>
          {renderScreen()}
        </View>
        
        {/* Sticky Footer */}
        <Footer />
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
