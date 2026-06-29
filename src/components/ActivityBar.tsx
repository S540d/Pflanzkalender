import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, PanResponder, StyleProp, ViewStyle } from 'react-native';
import { Activity } from '../types';
import { getContrastTextColor } from '../utils/colorUtils';
import { MONTH_SHORT } from '../utils/monthHelper';
import { getActivityTypeByType } from '../constants/activityTypes';
import { Icon } from './ui';
import { radius, shadow } from '../constants/designTokens';

// Bewegung (px) unterhalb derer ein Druck als Tap (→ Bearbeiten) statt als
// Drag (→ Verschieben) gewertet wird.
const TAP_THRESHOLD = 5;

interface ActivityBarProps {
  activity: Activity;
  onPress?: () => void;
  /**
   * Drag & Drop (Issue #142): meldet eine Verschiebung in *angezeigten*
   * Monats-Einheiten (positiv = nach rechts/später). Die Umrechnung auf
   * Halbmonate und das Clamping übernimmt der Aufrufer, der die echte
   * (nicht portrait-konvertierte) Aktivität kennt.
   */
  onMove?: (deltaUnits: number) => void;
  totalMonths?: number; // Anzahl der sichtbaren Monate (default: 24)
  cellWidth?: number; // Breite einer Monatszelle in px (für px → Einheiten)
}

// Web-spezifische Props (Maus-Handler), die RNW akzeptiert, aber die View-Typen
// nicht deklarieren – analog zu MonthCellWebProps in PlantRow.tsx.
interface ActivityBarWebProps {
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: 'button';
  accessibilityLabel?: string;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activity,
  onPress,
  onMove,
  totalMonths = 24,
  cellWidth = 40,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dragPx, setDragPx] = useState(0); // gesnappte visuelle Verschiebung
  const [webDragging, setWebDragging] = useState(false);

  // Refs gegen Stale-Closures (PanResponder + Window-Listener werden einmal gebunden).
  // Direkt im Render-Body aktualisieren (nicht via useEffect), damit der Wert beim
  // Feuern eines Handlers garantiert aktuell ist – kein Frame mit altem cellWidth.
  const onPressRef = useRef(onPress);
  const onMoveRef = useRef(onMove);
  const cellWidthRef = useRef(cellWidth);
  onPressRef.current = onPress;
  onMoveRef.current = onMove;
  cellWidthRef.current = cellWidth;

  // Berechne Position und Breite basierend auf Start- und Endmonat
  const startPosition = (activity.startMonth / totalMonths) * 100;
  const width = ((activity.endMonth - activity.startMonth + 1) / totalMonths) * 100;

  const getMonthLabel = (halfMonth: number) => {
    const monthIndex = Math.floor(halfMonth / 2);
    const half = halfMonth % 2 === 0 ? '1. H' : '2. H';
    return `${MONTH_SHORT[monthIndex]} ${half}`;
  };

  const tooltipText = `${activity.label}\n${getMonthLabel(activity.startMonth)} - ${getMonthLabel(activity.endMonth)}`;

  // ---- Native: PanResponder für Touch-Drag ---------------------------------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => Platform.OS !== 'web',
      onMoveShouldSetPanResponder: (_e, g) =>
        Platform.OS !== 'web' && Math.abs(g.dx) > TAP_THRESHOLD && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_e, g) => {
        const cw = cellWidthRef.current || 1;
        setDragPx(Math.round(g.dx / cw) * cw);
      },
      onPanResponderRelease: (_e, g) => {
        const cw = cellWidthRef.current || 1;
        if (Math.abs(g.dx) < TAP_THRESHOLD && Math.abs(g.dy) < TAP_THRESHOLD) {
          onPressRef.current?.();
        } else {
          const delta = Math.round(g.dx / cw);
          if (delta !== 0) onMoveRef.current?.(delta);
        }
        setDragPx(0);
      },
      onPanResponderTerminate: () => setDragPx(0),
    })
  ).current;

  // ---- Web: Maus-Drag (kein PanResponder, um Scroll-Konflikte zu vermeiden) -
  const dragStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !webDragging) return;
    // platform-safe: window nur im Web verfügbar
    if (typeof window === 'undefined') return;

    const handleMove = (e: MouseEvent) => {
      if (dragStartXRef.current === null) return;
      const cw = cellWidthRef.current || 1;
      const raw = e.clientX - dragStartXRef.current;
      setDragPx(Math.round(raw / cw) * cw);
    };
    const handleUp = (e: MouseEvent) => {
      const cw = cellWidthRef.current || 1;
      const raw = dragStartXRef.current === null ? 0 : e.clientX - dragStartXRef.current;
      dragStartXRef.current = null;
      setDragPx(0);
      setWebDragging(false);
      // Einzige Quelle der Wahrheit für Tap vs. Drag: die zurückgelegte Distanz.
      if (Math.abs(raw) < TAP_THRESHOLD) {
        onPressRef.current?.();
      } else {
        const delta = Math.round(raw / cw);
        if (delta !== 0) onMoveRef.current?.(delta);
      }
    };

    window.addEventListener('mousemove', handleMove); // platform-safe
    window.addEventListener('mouseup', handleUp); // platform-safe
    return () => {
      window.removeEventListener('mousemove', handleMove); // platform-safe
      window.removeEventListener('mouseup', handleUp); // platform-safe
    };
  }, [webDragging]);

  const handleWebMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    // Verhindert, dass die darunterliegende Monatszelle ein Drag-to-Create startet
    e.stopPropagation();
    dragStartXRef.current = e.clientX;
    setWebDragging(true);
  };

  const barStyle: StyleProp<ViewStyle> = [
    styles.activityBar,
    shadow(1),
    {
      left: `${startPosition}%`,
      width: `${width}%`,
      backgroundColor: activity.color,
      transform: [{ translateX: dragPx }],
      zIndex: dragPx !== 0 ? 1000 : 1,
    },
  ];

  const contrastColor = getContrastTextColor(activity.color);
  const activityIcon = getActivityTypeByType(activity.type)?.icon;

  const labelNode = (
    <View style={styles.labelRow}>
      {activityIcon ? <Icon name={activityIcon} size={13} color={contrastColor} /> : null}
      <Text style={[styles.label, { color: contrastColor }]} numberOfLines={1}>
        {activity.label}
      </Text>
    </View>
  );

  if (Platform.OS === 'web') {
    const webProps: ActivityBarWebProps = {
      onMouseDown: handleWebMouseDown,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      style: [barStyle, { cursor: webDragging ? 'grabbing' : 'grab' } as unknown as ViewStyle],
      accessibilityRole: 'button',
      accessibilityLabel: activity.label,
    };
    return (
      <>
        <View {...(webProps as React.ComponentProps<typeof View>)}>{labelNode}</View>
        {isHovered && !webDragging && (
          <View style={[styles.tooltip, { left: `${startPosition}%` }]} pointerEvents="none">
            <Text style={styles.tooltipText}>{tooltipText}</Text>
          </View>
        )}
      </>
    );
  }

  return (
    <View
      {...panResponder.panHandlers}
      style={barStyle}
      accessibilityRole="button"
      accessibilityLabel={activity.label}
    >
      {labelNode}
    </View>
  );
};

const styles = StyleSheet.create({
  activityBar: {
    position: 'absolute',
    height: 30,
    borderRadius: radius.sm,
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginVertical: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
