import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onBack?: () => void;
}

export const ScreenHeader: React.FC<Props> = ({ title, onBack }) => (
  <View style={styles.header}>
    {onBack && (
      <TouchableOpacity style={styles.btn} onPress={onBack}>
        <Text style={styles.btnText}>‹</Text>
      </TouchableOpacity>
    )}
    <Text style={styles.title}>{title}</Text>
    <View style={styles.space} />
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 28, color: '#2E7D32', lineHeight: 32 },
  title: { fontSize: 18, fontWeight: '800', color: '#1A2B1A' },
  space: { width: 40 },
});
