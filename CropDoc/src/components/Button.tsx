import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const AppButton: React.FC<Props> = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity
    style={variant === 'primary' ? styles.primary : styles.secondary}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Text style={variant === 'primary' ? styles.primaryText : styles.secondaryText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primary: { backgroundColor: '#2E7D32', borderRadius: 15, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondary: { backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#C9DCC9', marginBottom: 10 },
  secondaryText: { color: '#2E7D32', fontSize: 16, fontWeight: '700' },
});
