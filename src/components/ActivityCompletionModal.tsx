import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import type { ActivityCompletion } from '../types';
import { radius, spacing } from '../constants/designTokens';
import { isValidIsoDate, toIsoDate } from '../utils/completions';
import { Button } from './ui';

interface ActivityCompletionModalProps {
  visible: boolean;
  plantName: string;
  activityLabel: string;
  year: number;
  completion: ActivityCompletion | undefined;
  onSave: (completion: ActivityCompletion) => void;
  onRemove: () => void;
  onClose: () => void;
}

export const ActivityCompletionModal: React.FC<ActivityCompletionModalProps> = ({
  visible,
  plantName,
  activityLabel,
  year,
  completion,
  onSave,
  onRemove,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setDate(completion?.date ?? toIsoDate(new Date()));
      setNote(completion?.note ?? '');
      setError('');
    }
  }, [visible, completion]);

  const handleSave = () => {
    const trimmed = date.trim();
    if (!isValidIsoDate(trimmed)) {
      setError(t('completion.invalidDate') as string);
      return;
    }
    const trimmedNote = note.trim();
    onSave(trimmedNote ? { date: trimmed, note: trimmedNote } : { date: trimmed });
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.modal, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('completion.title') as string} · {year}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {plantName} – {activityLabel}
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>
            {t('completion.date') as string}
          </Text>
          <TextInput
            testID="completion-date-input"
            style={inputStyle}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

          <Text style={[styles.label, { color: theme.text }]}>
            {t('completion.note') as string}
          </Text>
          <TextInput
            testID="completion-note-input"
            style={[inputStyle, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder={t('completion.notePlaceholder') as string}
            placeholderTextColor={theme.textSecondary}
            multiline
          />

          <View style={styles.actions}>
            {completion ? (
              <Button
                label={t('completion.remove') as string}
                variant="danger"
                size="sm"
                onPress={onRemove}
                testID="completion-remove"
              />
            ) : null}
            <View style={styles.spacer} />
            <Button
              label={t('common.cancel') as string}
              variant="secondary"
              size="sm"
              onPress={onClose}
            />
            <Button
              label={t('common.save') as string}
              size="sm"
              onPress={handleSave}
              testID="completion-save"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', maxWidth: 400, padding: 24, borderRadius: radius.xl },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '500', marginTop: spacing.md, marginBottom: 8 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, fontSize: 16 },
  noteInput: { minHeight: 70, textAlignVertical: 'top' },
  error: { fontSize: 13, marginTop: 6 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  spacer: { flex: 1 },
});
