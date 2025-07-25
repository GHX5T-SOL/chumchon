import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';

const NotFoundScreen = () => (
  <View style={[{ flex: 1, backgroundColor: theme.colors.background }, cyberpunkStyles.animePanel]}>
    <Text style={[cyberpunkStyles.neonGlow, styles.title]}>404 - Not Found</Text>
    <Text style={styles.placeholder}>The page you are looking for does not exist.</Text>
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

export default NotFoundScreen; 