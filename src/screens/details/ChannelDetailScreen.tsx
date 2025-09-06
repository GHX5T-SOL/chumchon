import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';
import { AppPage } from '@/components/app-page'
import { MotiView } from 'moti'
import { MotiPressable } from 'moti/interactions'
import { useNavigation, useRoute } from '@react-navigation/native';

const ChannelDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { channelAddress } = route.params || {};

  return (
    <AppPage>
      <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }} style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Channel Details</Text>
        <Text style={styles.placeholder}>Coming soon: View posts, tip, and join creator channels.</Text>
        <MotiPressable from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 60, type: 'timing', duration: 300 }} pressStyle={{ scale: 0.98 }} style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('Tip', { groupAddress: channelAddress })}>
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Tip Channel Creator</Text>
        </MotiPressable>
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
  button: {
    margin: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChannelDetailScreen; 