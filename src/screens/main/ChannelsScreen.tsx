import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppPage } from '@/components/app-page'
import { cyberpunkStyles, theme } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const ChannelsScreen = () => {
  console.log('ChannelsScreen rendered');
  const navigation = useNavigation();
  // Placeholder channel list
  const channels = [
    { id: '1', name: 'Alpha Signals', description: 'Premium trading signals' },
    { id: '2', name: 'NFT Drops', description: 'Exclusive NFT news' },
  ];
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <AppPage>
      <View style={styles.listContainer}>
        {channels.map(channel => (
          <TouchableOpacity
            key={channel.id}
            style={[styles.channelCard, cyberpunkStyles.neonBorder]}
            onPress={() => (navigation as any).navigate('ChannelDetail', { channelAddress: channel.id })}
          >
            <Text style={[styles.channelName, cyberpunkStyles.neonGlow]}>{channel.name}</Text>
            <Text style={styles.channelDesc}>{channel.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </AppPage>
    </ScrollView>
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
  listContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  channelCard: {
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.card,
    width: '90%',
    alignItems: 'center',
  },
  channelName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.accent,
  },
  channelDesc: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
});

export default ChannelsScreen; 