import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.box}>
    <Text style={styles.icon}>🍃</Text>
    <Text style={styles.msg}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  icon: { fontSize: 48, marginBottom: 12 },
  msg: { fontSize: 15, color: '#6B756B', textAlign: 'center' },
});
