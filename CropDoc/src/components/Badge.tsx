import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Badge: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.badge}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  text: { color: '#2E7D32', fontSize: 12, fontWeight: '700' },
});
