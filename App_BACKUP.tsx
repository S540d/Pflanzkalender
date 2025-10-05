import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pflanzkalender PWA</Text>
      <Text style={styles.subtitle}>Die App läuft!</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>Dies ist ein Test</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 32,
  },
  box: {
    backgroundColor: '#4CAF50',
    padding: 24,
    borderRadius: 12,
  },
  boxText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
