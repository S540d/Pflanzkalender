import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Activity } from '../types';

interface EditActivityModalProps {
  visible: boolean;
  activity: Activity | null;
  plantName: string;
  onClose: () => void;
  onUpdate: (activityId: string, updates: Partial<Activity>) => void;
  onDelete: (activityId: string) => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  visible,
  activity,
  plantName,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const { theme } = useTheme();
  const [label, setLabel] = useState(activity?.label || '');

  React.useEffect(() => {
    if (activity) {
      setLabel(activity.label);
    }
  }, [activity]);

  if (!activity) return null;

  const handleUpdate = () => {
    onUpdate(activity.id, { label });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Aktivität wirklich löschen?')) {
      onDelete(activity.id);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Aktivität bearbeiten</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{plantName}</Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Bezeichnung</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={label}
              onChangeText={setLabel}
              placeholder="z.B. Aussäen"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Zeitraum</Text>
            <Text style={[styles.value, { color: theme.textSecondary }]}>
              {getMonthName(activity.startMonth)} - {getMonthName(activity.endMonth)}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={[styles.colorPreview, { backgroundColor: activity.color }]} />
            <Text style={[styles.value, { color: theme.textSecondary }]}>{activity.type}</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: '#DC143C' }]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Löschen</Text>
            </TouchableOpacity>

            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.border }]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Abbrechen</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getMonthName = (monthIndex: number): string => {
  const months = [
    'Jan 1-15', 'Jan 16-31', 'Feb 1-15', 'Feb 16-28', 'Mär 1-15', 'Mär 16-31',
    'Apr 1-15', 'Apr 16-30', 'Mai 1-15', 'Mai 16-31', 'Jun 1-15', 'Jun 16-30',
    'Jul 1-15', 'Jul 16-31', 'Aug 1-15', 'Aug 16-31', 'Sep 1-15', 'Sep 16-30',
    'Okt 1-15', 'Okt 16-31', 'Nov 1-15', 'Nov 16-30', 'Dez 1-15', 'Dez 16-31',
  ];
  return months[monthIndex] || '';
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  value: {
    fontSize: 14,
  },
  colorPreview: {
    width: 40,
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButton: {
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
