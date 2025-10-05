import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity } from '../types';

interface ActivityBarProps {
  activity: Activity;
  onPress?: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activity, onPress }) => {
  // Berechne Position und Breite basierend auf Start- und Endmonat
  const startPosition = (activity.startMonth / 24) * 100; // 24 halbe Monate
  const width = ((activity.endMonth - activity.startMonth + 1) / 24) * 100;

  return (
    <TouchableOpacity
      style={[
        styles.activityBar,
        {
          left: `${startPosition}%`,
          width: `${width}%`,
          backgroundColor: activity.color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label} numberOfLines={1}>
        {activity.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityBar: {
    position: 'absolute',
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginVertical: 2,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
