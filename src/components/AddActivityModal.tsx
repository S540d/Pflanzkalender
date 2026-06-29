import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { ACTIVITY_TYPES } from '../constants/activityTypes';
import { Icon } from './ui';
import { radius } from '../constants/designTokens';

interface AddActivityModalProps {
  visible: boolean;
  plantName: string;
  initialMonth?: number;
  initialEndMonth?: number;
  onClose: () => void;
  onAdd: (type: string, startMonth: number, endMonth: number, color: string, label: string) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  visible,
  plantName,
  initialMonth = 0,
  initialEndMonth,
  onClose,
  onAdd,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState(ACTIVITY_TYPES[0].type);
  const [startMonth, setStartMonth] = useState(initialMonth);
  const [endMonth, setEndMonth] = useState(initialEndMonth ?? initialMonth);
  const [customLabel, setCustomLabel] = useState('');
  const [rangeError, setRangeError] = useState('');

  useEffect(() => {
    if (visible) {
      setStartMonth(initialMonth);
      setEndMonth(initialEndMonth ?? initialMonth);
      setSelectedType(ACTIVITY_TYPES[0].type);
      setCustomLabel('');
      setRangeError('');
    }
  }, [visible, initialMonth, initialEndMonth]);

  const selectedActivityType = ACTIVITY_TYPES.find((at) => at.type === selectedType);
  const typeLabel = (type: string) => t(`activity.type.${type}`) as string;
  const label = customLabel || typeLabel(selectedType) || '';

  const handleAdd = () => {
    if (startMonth > endMonth) {
      setRangeError(t('activity.edit.rangeError') as string);
      return;
    }
    if (selectedActivityType) {
      onAdd(selectedType, startMonth, endMonth, selectedActivityType.color, label);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const monthLabels = t('agenda.months') as string[];
  const months = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: monthLabels[i],
  }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: theme.overlay }]}
          activeOpacity={1}
          onPress={handleCancel}
        />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t('activity.add.title') as string}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {t('activity.add.subtitle') as string} {plantName}
            </Text>
          </View>

          <ScrollView style={styles.content}>
            {/* Aktivitätstyp */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('activity.add.typeLabel') as string}
              </Text>
              <View style={styles.typeGrid}>
                {ACTIVITY_TYPES.map((activityType) => {
                  const isSelected = selectedType === activityType.type;
                  return (
                    <TouchableOpacity
                      key={activityType.type}
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: isSelected ? activityType.color : theme.surface,
                          borderColor: isSelected ? activityType.color : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedType(activityType.type)}
                    >
                      <Icon
                        name={activityType.icon}
                        size={15}
                        color={isSelected ? '#FFFFFF' : activityType.color}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          { color: isSelected ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {typeLabel(activityType.type)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Zeitraum */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('activity.add.periodLabel') as string}
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
                          startMonth === month.value && {
                            backgroundColor: theme.primary,
                          },
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
                            {
                              color: startMonth === month.value ? '#FFFFFF' : theme.text,
                            },
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
                          endMonth === month.value && {
                            backgroundColor: theme.primary,
                          },
                          month.value < startMonth && styles.monthDisabled,
                        ]}
                        onPress={() => {
                          if (month.value >= startMonth) {
                            setEndMonth(month.value);
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

            {/* Custom Label */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('activity.add.customLabel') as string}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder={
                  selectedActivityType ? typeLabel(selectedActivityType.type) : undefined
                }
                placeholderTextColor={theme.textSecondary}
                value={customLabel}
                onChangeText={setCustomLabel}
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, { color: theme.text }]}>
                {t('common.cancel') as string}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.addButton,
                { backgroundColor: selectedActivityType?.color || theme.primary },
              ]}
              onPress={handleAdd}
            >
              <Text style={styles.addButtonText}>{t('common.add') as string}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modal: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '85%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  monthOptionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  monthDisabled: {
    opacity: 0.3,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  addButton: {
    // backgroundColor wird dynamisch gesetzt
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
