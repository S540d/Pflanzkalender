import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const Footer: React.FC = () => {
  const { theme } = useTheme();

  const handleSupportPress = () => {
    Linking.openURL('https://buymeacoffee.com/sven4321');
  };

  return (
    <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      <TouchableOpacity 
        style={[styles.supportButton, { backgroundColor: '#FFD700' }]} 
        onPress={handleSupportPress}
      >
        <Text style={styles.coffeeIcon}>☕</Text>
        <Text style={styles.supportText}>Support me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  coffeeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  
  supportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});