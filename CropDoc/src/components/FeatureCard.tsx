import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  icon: string;
  title: string;
  desc: string;
}

export const FeatureCard: React.FC<Props> = ({ icon, title, desc }) => (
  <View style={styles.card}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.desc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8EFE8' },
  icon: { fontSize: 24, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2D20', marginBottom: 4 },
  desc: { fontSize: 13, color: '#6B756B', lineHeight: 18 },
});
