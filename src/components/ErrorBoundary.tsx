import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';

// The ErrorBoundary wraps LanguageProvider, so it cannot rely on useLanguage()
// and must detect the language on its own if it needs to render a fallback.
function isGermanLocale(): boolean {
  if (Platform.OS !== 'web') return true; // platform-safe
  const locale = typeof navigator !== 'undefined' ? navigator.language : undefined; // platform-safe
  return !locale || locale.toLowerCase().startsWith('de');
}

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

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = async () => {
    if (Platform.OS === 'web') {
      // Clear all caches before reloading (web only) // platform-safe
      if ('caches' in window) {
        const names = await caches.keys(); // platform-safe
        await Promise.all(names.map((name) => caches.delete(name))); // platform-safe
      }
      window.location.reload(); // platform-safe
    } else {
      // On native: reset error state so the component tree re-renders
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  render() {
    if (this.state.hasError) {
      const isDe = isGermanLocale();
      const webUserAgent = Platform.OS === 'web' ? navigator.userAgent : ''; // platform-safe
      const webScreen = Platform.OS === 'web' ? `${window.innerWidth}x${window.innerHeight}` : ''; // platform-safe
      const webUrl = Platform.OS === 'web' ? window.location.href : ''; // platform-safe
      return (
        <View style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 20 }}>
          <View
            style={{
              backgroundColor: '#ff4444',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 5,
              }}
            >
              {isDe ? '⚠️ App Fehler' : '⚠️ App Error'}
            </Text>
            <Text style={{ color: 'white', fontSize: 14 }}>
              {isDe ? 'Die App ist auf einen Fehler gestoßen' : 'The app has encountered an error'}
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: '#2a2a2a',
                padding: 15,
                borderRadius: 8,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: '#ff6666',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                {this.state.error?.toString()}
              </Text>

              {this.state.errorInfo && (
                <Text
                  style={{
                    color: '#aaa',
                    fontFamily: 'monospace',
                    fontSize: 10,
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>

            {Platform.OS === 'web' && (
              <View
                style={{
                  backgroundColor: '#2a2a2a',
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 15,
                }}
              >
                <Text style={{ color: '#00ff00', fontSize: 12, marginBottom: 10 }}>
                  {isDe ? 'Debug-Informationen:' : 'Debug information:'}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace' }}>
                  User Agent: {webUserAgent}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace' }}>
                  {isDe ? 'Bildschirm' : 'Screen'}: {webScreen}
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
              {Platform.OS === 'web'
                ? isDe
                  ? '🔄 Cache leeren & Neu laden'
                  : '🔄 Clear Cache & Reload'
                : isDe
                  ? '🔄 App zurücksetzen'
                  : '🔄 Reset App'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
