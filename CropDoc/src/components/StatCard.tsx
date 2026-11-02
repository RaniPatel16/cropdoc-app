import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#2E7D32', borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 20 },
  value: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  label: { fontSize: 14, color: '#C8E6C9', fontWeight: '600' },
});
