import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cyberpunkStyles, theme } from '../../theme';

const SettingsScreen = () => (
  <View style={[{ flex: 1, backgroundColor: theme.colors.background }, cyberpunkStyles.animePanel]}>
    <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Settings</Text>
    <Text style={styles.placeholder}>Customize your experience. Dark mode, notifications, and more coming soon.</Text>
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

export default SettingsScreen; 