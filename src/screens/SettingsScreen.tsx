import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingsModal } from '../components/SettingsModal';
import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;

export const SettingsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setModalVisible(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1 }}>
      <SettingsModal visible={modalVisible} onClose={handleClose} />
    </View>
  );
};
