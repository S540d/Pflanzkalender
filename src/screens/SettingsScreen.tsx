import React, { useState } from 'react';
import { View } from 'react-native';
import { SettingsModal } from '../components/SettingsModal';

export const SettingsScreen: React.FC = () => {
  const [modalVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <SettingsModal visible={modalVisible} onClose={() => {}} />
    </View>
  );
};
