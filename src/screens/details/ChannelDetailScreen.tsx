import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';
import { AppPage } from '@/components/app-page'
// Removed Moti animations to simplify startup
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '@/navigation/AppNavigator';

const ChannelDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'ChannelDetail'>>();
  const { channelAddress } = route.params;

  return (
    <AppPage>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Channel Details</Text>
        <Text style={styles.placeholder}>Coming soon: View posts, tip, and join creator channels.</Text>
        <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => (navigation as any).navigate('Tip', { groupAddress: channelAddress })} activeOpacity={0.8}>
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Tip Channel Creator</Text>
        </TouchableOpacity>
      </View>
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