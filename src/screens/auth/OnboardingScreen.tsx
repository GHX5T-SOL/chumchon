import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }, cyberpunkStyles.animePanel]}>
      <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Welcome to Chumchon!</Text>
      <Text style={styles.placeholder}>Interactive onboarding and tutorials coming soon.</Text>
    </View>
  );
};

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

export default OnboardingScreen; 