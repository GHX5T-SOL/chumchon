import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';

const TipScreen = () => (
  <View style={[{ flex: 1, backgroundColor: theme.colors.background }, cyberpunkStyles.animePanel]}>
    <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Tip User</Text>
    <Text style={styles.placeholder}>Send SOL or tokens as a tip. Fast, secure, and fun. Coming soon.</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.xxl,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
});

export default TipScreen; 