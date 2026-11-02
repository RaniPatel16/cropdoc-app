import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => (
  <View style={styles.row}>
    <View style={styles.bg}>
      <View style={[styles.fill, { width: `${confidence}%` }]} />
    </View>
    <Text style={styles.label}>{confidence}% confidence</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { width: '100%', alignItems: 'center' },
  bg: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, marginBottom: 6 },
  fill: { height: 8, backgroundColor: '#FFFFFF', borderRadius: 4 },
  label: { fontSize: 14, color: '#C8E6C9', fontWeight: '600' },
});
