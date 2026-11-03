import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { radius, spacing } from '../constants/designTokens';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme';
import type { ActivityInfo } from '../utils/agendaActivities';
import { Card, Icon } from './ui';

interface ActivityCardProps {
  activity: ActivityInfo;
  /** Abhaken bzw. Haken entfernen. */
  onToggle: (activity: ActivityInfo) => void;
  /** Datum/Notiz der Erledigung bearbeiten (langer Druck bzw. Tipp auf die Erledigt-Zeile). */
  onEdit: (activity: ActivityInfo) => void;
}

/** Aufgabenkarte mit Abhak-Box – gemeinsam für „Jetzt im Garten" und die Agenda-Spalten. */
export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onToggle, onEdit }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const done = !!activity.completion;

  return (
    <Card
      elevation={1}
      padding={spacing.md}
      style={[
        styles.card,
        { borderLeftWidth: 4, borderLeftColor: activity.activityColor },
        done && styles.cardDone,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconChip, { backgroundColor: activity.activityColor }]}>
          {activity.activityIcon ? (
            <Icon name={activity.activityIcon} size={13} color="#FFFFFF" />
          ) : null}
        </View>
        <Text
          style={[styles.activityLabel, { color: theme.text }, done && styles.activityLabelDone]}
        >
          {activity.activityLabel}
        </Text>
        <TouchableOpacity
          testID={`agenda-check-${activity.plantId}-${activity.activityId}-${activity.year}`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={String(t(done ? 'completion.markOpen' : 'completion.markDone'))}
          onPress={() => onToggle(activity)}
          onLongPress={() => onEdit(activity)}
          hitSlop={8}
          style={[
            styles.checkbox,
            { borderColor: done ? theme.primary : theme.border },
            done && { backgroundColor: theme.primary },
          ]}
        >
          {done ? <Icon name="check" size={14} color={theme.onPrimary} /> : null}
        </TouchableOpacity>
      </View>
      <View style={styles.plantNameRow}>
        <Text style={styles.plantEmoji}>{activity.plantEmoji}</Text>
        <Text style={[styles.plantName, { color: theme.text }]}>{activity.plantName}</Text>
      </View>
      {activity.completion ? (
        <TouchableOpacity
          testID={`agenda-done-${activity.plantId}-${activity.activityId}-${activity.year}`}
          onPress={() => onEdit(activity)}
        >
          <Text style={[styles.doneInfo, { color: theme.primary }]}>
            ✓ {activity.completion.date}
            {activity.completion.note ? ` – ${activity.completion.note}` : ''}
          </Text>
        </TouchableOpacity>
      ) : null}
      {activity.notes && (
        <Text style={[styles.notes, { color: theme.textSecondary }]}>{activity.notes}</Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  cardDone: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  iconChip: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  activityLabelDone: {
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  plantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  plantEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  plantName: {
    fontSize: 15,
    fontWeight: '600',
  },
  doneInfo: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    lineHeight: 17,
  },
});
