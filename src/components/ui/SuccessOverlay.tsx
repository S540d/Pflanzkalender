import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Icon } from './Icon';
import { radius, duration as durationTokens } from '../../constants/designTokens';

interface SuccessOverlayProps {
  /** Startet die Pulse-Animation, sobald true; ruft danach onDone(). */
  visible: boolean;
  color?: string;
  onDone: () => void;
  /** Wie lange der Checkmark sichtbar bleibt, bevor onDone() feuert (ms). */
  holdDuration?: number;
}

/**
 * Kurzer Erfolgs-Puls (Checkmark, Scale+Fade) für Speichern/Löschen-Aktionen.
 * `onDone` übernimmt das eigentliche Schließen des aufrufenden Modals –
 * die Komponente selbst kennt keine Modal-Logik.
 */
export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  visible,
  color = '#4CAF50',
  onDone,
  holdDuration = 260,
}) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    scale.setValue(0.5);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationTokens.fast,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onDone, holdDuration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none" testID="success-overlay">
      <Animated.View
        style={[styles.badge, { backgroundColor: color, opacity, transform: [{ scale }] }]}
      >
        <Icon name="check" size={28} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
