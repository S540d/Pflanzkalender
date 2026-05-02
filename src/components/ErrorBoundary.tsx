import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    if (Platform.OS === 'web') {
      // Clear all caches and reload (web only) // platform-safe
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      window.location.reload(); // platform-safe
    } else {
      // On native: reset error state so the component tree re-renders
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  render() {
    if (this.state.hasError) {
      const webUserAgent = Platform.OS === 'web' ? navigator.userAgent : ''; // platform-safe
      const webScreen = Platform.OS === 'web' ? `${window.innerWidth}x${window.innerHeight}` : ''; // platform-safe
      const webUrl = Platform.OS === 'web' ? window.location.href : ''; // platform-safe
      return (
        <View style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 20 }}>
          <View style={{
            backgroundColor: '#ff4444',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20
          }}>
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 5
            }}>
              ⚠️ App Fehler
            </Text>
            <Text style={{ color: 'white', fontSize: 14 }}>
              Die App ist auf einen Fehler gestoßen
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View style={{
              backgroundColor: '#2a2a2a',
              padding: 15,
              borderRadius: 8,
              marginBottom: 15
            }}>
              <Text style={{
                color: '#ff6666',
                fontFamily: 'monospace',
                fontSize: 12,
                marginBottom: 10
              }}>
                {this.state.error?.toString()}
              </Text>

              {this.state.errorInfo && (
                <Text style={{
                  color: '#aaa',
                  fontFamily: 'monospace',
                  fontSize: 10
                }}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>

            {Platform.OS === 'web' && (
              <View style={{
                backgroundColor: '#2a2a2a',
                padding: 15,
                borderRadius: 8,
                marginBottom: 15
              }}>
                <Text style={{ color: '#00ff00', fontSize: 12, marginBottom: 10 }}>
                  Debug-Informationen:
                </Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace' }}>
                  User Agent: {webUserAgent}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace' }}>
                  Bildschirm: {webScreen}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace' }}>
                  URL: {webUrl}
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={this.handleReload}
            style={{
              backgroundColor: '#4CAF50',
              padding: 15,
              borderRadius: 8,
              marginTop: 15,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              🔄 Cache leeren & Neu laden
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
