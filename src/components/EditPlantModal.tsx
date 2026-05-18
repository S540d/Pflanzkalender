import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { Plant, PlantLocation, PlantCategory } from '../types';
import { PLANT_LOCATION_METADATA, PLANT_CATEGORY_METADATA } from '../constants/plantMetadata';

const LOCATION_OPTIONS: { value: PlantLocation; icon: string }[] = (
  Object.keys(PLANT_LOCATION_METADATA) as PlantLocation[]
).map((value) => ({
  value,
  icon: PLANT_LOCATION_METADATA[value].icon,
}));

const CATEGORY_OPTIONS: { value: PlantCategory; icon: string }[] = (
  Object.keys(PLANT_CATEGORY_METADATA) as PlantCategory[]
).map((value) => ({
  value,
  icon: PLANT_CATEGORY_METADATA[value].icon,
}));

interface EditPlantModalProps {
  visible: boolean;
  plant: Plant;
  onClose: () => void;
  onSave: (id: string, updates: Pick<Plant, 'name' | 'notes' | 'location' | 'category'>) => void;
}

export const EditPlantModal: React.FC<EditPlantModalProps> = ({
  visible,
  plant,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const metaLang: 'de' | 'en' = language === 'de' ? 'de' : 'en';
  const [name, setName] = useState(plant.name);
  const [notes, setNotes] = useState(plant.notes ?? '');
  const [location, setLocation] = useState<PlantLocation | undefined>(plant.location);
  const [category, setCategory] = useState<PlantCategory | undefined>(plant.category);

  useEffect(() => {
    if (visible) {
      setName(plant.name);
      setNotes(plant.notes ?? '');
      setLocation(plant.location);
      setCategory(plant.category);
    }
  }, [visible, plant]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(plant.id, { name: name.trim(), notes: notes.trim(), location, category });
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel} />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t('plants.editTitle') as string}
            </Text>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('plants.fieldName') as string} *
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
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('plants.fieldNotes') as string}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('plants.fieldLocation') as string}
              </Text>
              <View style={styles.optionRow}>
                {LOCATION_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: location === opt.value ? theme.primary : theme.surface,
                        borderColor: location === opt.value ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setLocation(location === opt.value ? undefined : opt.value)}
                  >
                    <Text style={styles.optionIcon}>{opt.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: location === opt.value ? '#fff' : theme.text },
                      ]}
                    >
                      {PLANT_LOCATION_METADATA[opt.value][metaLang]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('plants.fieldCategory') as string}
              </Text>
              <View style={styles.optionRow}>
                {CATEGORY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: category === opt.value ? theme.primary : theme.surface,
                        borderColor: category === opt.value ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setCategory(category === opt.value ? undefined : opt.value)}
                  >
                    <Text style={styles.optionIcon}>{opt.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: category === opt.value ? '#fff' : theme.text },
                      ]}
                    >
                      {PLANT_CATEGORY_METADATA[opt.value][metaLang]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, { color: theme.text }]}>
                {t('plants.deleteCancel') as string}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                { backgroundColor: theme.primary },
                !name.trim() && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>{t('plants.editSave') as string}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '600',
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
  saveButton: {},
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
