import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  icon: string;
  title: string;
  items: string[];
}

export const TreatmentCard: React.FC<Props> = ({ icon, title, items }) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
    {items.map((item, i) => (
      <View key={i} style={styles.item}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.text}>{item}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#DDE8DD', marginBottom: 14 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  icon: { fontSize: 18 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2D20' },
  item: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { fontSize: 14, color: '#2E7D32', marginRight: 8, marginTop: 1 },
  text: { fontSize: 14, color: '#4B554B', flex: 1, lineHeight: 20 },
});
