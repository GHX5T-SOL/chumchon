import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cyberpunkStyles, theme } from '../../theme';

const NFTProfilePickerScreen = () => (
  <View style={[{ flex: 1, backgroundColor: theme.colors.background }, cyberpunkStyles.animePanel]}>
    <Text style={[cyberpunkStyles.neonGlow, styles.title]}>NFT Profile Picture</Text>
    <Text style={styles.placeholder}>Choose your NFT as your profile picture. Coming soon.</Text>
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

export default NFTProfilePickerScreen; 