import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, Icon, type IconName } from './ui';
import { radius, spacing } from '../constants/designTokens';

export interface JournalEntry {
  key: string;
  plantId: string;
  activityId: string;
  plantName: string;
  plantEmoji: string;
  activityLabel: string;
  activityColor: string;
  activityIcon?: IconName;
  date: string; // YYYY-MM-DD
  note?: string;
}

interface ActivityJournalProps {
  year: number;
  entries: JournalEntry[];
  onEntryPress: (entry: JournalEntry) => void;
}

/** Liste aller erledigten Aktivitäten des Jahres, neueste zuerst. */
export const ActivityJournal: React.FC<ActivityJournalProps> = ({
  year,
  entries,
  onEntryPress,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.header, { color: theme.text }]}>
        {t('journal.title') as string} {year}
      </Text>
      {sorted.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          {t('journal.empty') as string}
        </Text>
      ) : (
        sorted.map((entry) => (
          <TouchableOpacity
            key={entry.key}
            onPress={() => onEntryPress(entry)}
            testID={`journal-entry-${entry.key}`}
          >
            <Card
              elevation={1}
              padding={spacing.md}
              style={[styles.card, { borderLeftWidth: 4, borderLeftColor: entry.activityColor }]}
            >
              <View style={styles.row}>
                <View style={[styles.iconChip, { backgroundColor: entry.activityColor }]}>
                  {entry.activityIcon ? (
                    <Icon name={entry.activityIcon} size={13} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text style={[styles.label, { color: theme.text }]}>
                  {entry.plantEmoji} {entry.plantName} – {entry.activityLabel}
                </Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>{entry.date}</Text>
              </View>
              {entry.note ? (
                <Text style={[styles.note, { color: theme.textSecondary }]}>{entry.note}</Text>
              ) : null}
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  header: { fontSize: 18, fontWeight: '700', marginBottom: spacing.md },
  empty: { fontSize: 14, textAlign: 'center', marginTop: spacing.xl },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconChip: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 14, fontWeight: '600' },
  date: { fontSize: 12 },
  note: { fontSize: 12, lineHeight: 17, marginTop: 6 },
});
