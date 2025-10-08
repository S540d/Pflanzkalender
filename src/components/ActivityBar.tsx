import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Activity } from '../types';

interface ActivityBarProps {
  activity: Activity;
  onPress?: () => void;
  totalMonths?: number; // Anzahl der sichtbaren Monate (default: 24)
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activity, onPress, totalMonths = 24 }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Berechne Position und Breite basierend auf Start- und Endmonat
  const startPosition = (activity.startMonth / totalMonths) * 100;
  const width = ((activity.endMonth - activity.startMonth + 1) / totalMonths) * 100;

  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const getMonthLabel = (halfMonth: number) => {
    const monthIndex = Math.floor(halfMonth / 2);
    const half = halfMonth % 2 === 0 ? '1. H' : '2. H';
    return `${monthNames[monthIndex]} ${half}`;
  };

  const tooltipText = `${activity.label}\n${getMonthLabel(activity.startMonth)} - ${getMonthLabel(activity.endMonth)}`;

  const touchableProps: any = {
    style: [
      styles.activityBar,
      {
        left: `${startPosition}%`,
        width: `${width}%`,
        backgroundColor: activity.color,
      },
    ],
    onPress,
    activeOpacity: 0.7,
  };

  // Add web-only hover handlers
  if (Platform.OS === 'web') {
    touchableProps.onMouseEnter = () => setIsHovered(true);
    touchableProps.onMouseLeave = () => setIsHovered(false);
  }

  return (
    <>
      <TouchableOpacity {...touchableProps}>
        <Text style={styles.label} numberOfLines={1}>
          {activity.label}
        </Text>
      </TouchableOpacity>

      {isHovered && Platform.OS === 'web' && (
        <View style={[styles.tooltip, { left: `${startPosition}%` }]} pointerEvents="none">
          <Text style={styles.tooltipText}>{tooltipText}</Text>
        </View>
      )}
    </>
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
  tooltip: {
    position: 'absolute',
    top: -50,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 8,
    borderRadius: 6,
    zIndex: 1000,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
  },
});
