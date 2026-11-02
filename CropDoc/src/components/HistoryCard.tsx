import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  crop: string;
  disease: string;
  confidence: number;
  date: string;
  emoji: string;
  onPress: () => void;
}

export const HistoryCard: React.FC<Props> = ({ crop, disease, confidence, date, emoji, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconBox}><Text style={styles.emoji}>{emoji}</Text></View>
    <View style={styles.info}>
      <Text style={styles.crop}>{crop}</Text>
      <Text style={styles.disease}>{disease}</Text>
      <Text style={styles.meta}>{date} · {confidence}% confidence</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#E8EFE8' },
  iconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F8F0', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  emoji: { fontSize: 26 },
  info: { flex: 1 },
  crop: { fontSize: 16, fontWeight: '800', color: '#1A2B1A', marginBottom: 2 },
  disease: { fontSize: 14, color: '#D32F2F', fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 12, color: '#7A8A7A' },
  arrow: { fontSize: 24, color: '#A0B0A0', marginLeft: 8 },
});
