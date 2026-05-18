import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { Activity } from '../types';
import { HALF_MONTH_NAMES } from '../utils/monthHelper';

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
  const { t } = useLanguage();
  const [label, setLabel] = useState(activity?.label || '');
  const [startMonth, setStartMonth] = useState(activity?.startMonth ?? 0);
  const [endMonth, setEndMonth] = useState(activity?.endMonth ?? 0);
  const [rangeError, setRangeError] = useState('');

  React.useEffect(() => {
    if (activity) {
      setLabel(activity.label);
      setStartMonth(activity.startMonth);
      setEndMonth(activity.endMonth);
      setRangeError('');
    }
  }, [activity]);

  if (!activity) return null;

  const months = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: HALF_MONTH_NAMES[i],
  }));

  const handleUpdate = () => {
    if (startMonth > endMonth) {
      setRangeError(t('activity.edit.rangeError') as string);
      return;
    }
    setRangeError('');
    onUpdate(activity.id, { label, startMonth, endMonth });
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      t('activity.edit.deleteTitle') as string,
      t('activity.edit.deleteMessage') as string,
      [
        { text: t('common.cancel') as string, style: 'cancel' },
        {
          text: t('plants.deleteConfirm') as string,
          style: 'destructive',
          onPress: () => {
            onDelete(activity.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('activity.edit.title') as string}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{plantName}</Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('activity.edit.nameLabel') as string}
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
              ]}
              value={label}
              onChangeText={setLabel}
              placeholder="z.B. Aussäen"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('activity.edit.periodLabel') as string}
            </Text>
            <View style={styles.periodRow}>
              <View style={styles.periodField}>
                <Text style={[styles.periodLabel, { color: theme.textSecondary }]}>
                  {t('activity.add.from') as string}
                </Text>
                <ScrollView
                  style={[
                    styles.monthPicker,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      style={[
                        styles.monthOption,
                        startMonth === month.value && { backgroundColor: theme.primary },
                      ]}
                      onPress={() => {
                        setStartMonth(month.value);
                        if (month.value > endMonth) {
                          setEndMonth(month.value);
                        }
                        setRangeError('');
                      }}
                    >
                      <Text
                        style={[
                          styles.monthOptionText,
                          { color: startMonth === month.value ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {month.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.periodField}>
                <Text style={[styles.periodLabel, { color: theme.textSecondary }]}>
                  {t('activity.add.to') as string}
                </Text>
                <ScrollView
                  style={[
                    styles.monthPicker,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      style={[
                        styles.monthOption,
                        endMonth === month.value && { backgroundColor: theme.primary },
                        month.value < startMonth && styles.monthDisabled,
                      ]}
                      onPress={() => {
                        if (month.value >= startMonth) {
                          setEndMonth(month.value);
                          setRangeError('');
                        }
                      }}
                      disabled={month.value < startMonth}
                    >
                      <Text
                        style={[
                          styles.monthOptionText,
                          {
                            color:
                              endMonth === month.value
                                ? '#FFFFFF'
                                : month.value < startMonth
                                  ? theme.textSecondary
                                  : theme.text,
                          },
                        ]}
                      >
                        {month.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            {rangeError ? (
              <Text style={[styles.errorText, { color: theme.error ?? '#DC143C' }]}>
                {rangeError}
              </Text>
            ) : null}
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
              <Text style={styles.buttonText}>{t('plants.deleteConfirm') as string}</Text>
            </TouchableOpacity>

            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.border }]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>
                  {t('common.cancel') as string}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>{t('common.save') as string}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
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
    maxHeight: '90%',
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
  periodRow: {
    flexDirection: 'row',
    gap: 12,
  },
  periodField: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  monthPicker: {
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
  },
  monthOption: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  monthOptionText: {
    fontSize: 13,
    textAlign: 'center',
  },
  monthDisabled: {
    opacity: 0.3,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
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
