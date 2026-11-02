import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ScanGuideOverlay: React.FC = () => (
  <View style={styles.guide}>
    <Text style={styles.text}>Place the crop leaf inside the frame</Text>
  </View>
);

const styles = StyleSheet.create({
  guide: { alignSelf: 'center', borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 20, width: '80%', height: '45%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 15 },
  text: { color: '#FFFFFF', fontSize: 14, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 },
});
