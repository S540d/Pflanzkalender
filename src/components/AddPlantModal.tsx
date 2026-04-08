import React, { useState } from 'react';
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
import { PlantLocation, PlantCategory } from '../types';
import { PLANT_LOCATION_METADATA, PLANT_CATEGORY_METADATA } from '../constants/plantMetadata';

const LOCATION_OPTIONS: { value: PlantLocation; label: string; icon: string }[] =
  (Object.keys(PLANT_LOCATION_METADATA) as PlantLocation[]).map((value) => ({
    value,
    label: PLANT_LOCATION_METADATA[value].de,
    icon: PLANT_LOCATION_METADATA[value].icon,
  }));

const CATEGORY_OPTIONS: { value: PlantCategory; label: string; icon: string }[] =
  (Object.keys(PLANT_CATEGORY_METADATA) as PlantCategory[]).map((value) => ({
    value,
    label: PLANT_CATEGORY_METADATA[value].de,
    icon: PLANT_CATEGORY_METADATA[value].icon,
  }));

interface AddPlantModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, notes: string, location?: PlantLocation, category?: PlantCategory) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<PlantLocation | undefined>(undefined);
  const [category, setCategory] = useState<PlantCategory | undefined>(undefined);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), notes.trim(), location, category);
      setName('');
      setNotes('');
      setLocation(undefined);
      setCategory(undefined);
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setNotes('');
    setLocation(undefined);
    setCategory(undefined);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              Neue Pflanze hinzufügen
            </Text>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                Pflanzenname *
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
                placeholder="z.B. Tomaten"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Notizen</Text>
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
                placeholder="z.B. Beliebtes Gemüse für Balkon"
                placeholderTextColor={theme.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Standort</Text>
              <View style={styles.locationRow}>
                {LOCATION_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.locationButton,
                      {
                        backgroundColor: location === opt.value ? theme.primary : theme.surface,
                        borderColor: location === opt.value ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setLocation(location === opt.value ? undefined : opt.value)}
                  >
                    <Text style={styles.locationIcon}>{opt.icon}</Text>
                    <Text style={[styles.locationLabel, { color: location === opt.value ? '#fff' : theme.text }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Kategorie</Text>
              <View style={styles.locationRow}>
                {CATEGORY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.locationButton,
                      {
                        backgroundColor: category === opt.value ? theme.primary : theme.surface,
                        borderColor: category === opt.value ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setCategory(category === opt.value ? undefined : opt.value)}
                  >
                    <Text style={styles.locationIcon}>{opt.icon}</Text>
                    <Text style={[styles.locationLabel, { color: category === opt.value ? '#fff' : theme.text }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.hint}>
              <Text style={[styles.hintText, { color: theme.textSecondary }]}>
                Nach dem Hinzufügen kannst du Aktivitäten für die Pflanze
                erstellen.
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Abbrechen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.addButton,
                { backgroundColor: theme.primary },
                !name.trim() && styles.buttonDisabled,
              ]}
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text style={styles.addButtonText}>Hinzufügen</Text>
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
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  locationButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  locationIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  hint: {
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 18,
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
  buttonDisabled: {
    opacity: 0.5,
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
