import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';
import { AppPage } from '@/components/app-page'
import { MotiView } from 'moti'
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  return (
    <AppPage>
      <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }} style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Welcome to Chumchon!</Text>
        <Text style={styles.placeholder}>Interactive onboarding and tutorials coming soon.</Text>
      </MotiView>
    </AppPage>
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