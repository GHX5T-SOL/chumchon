import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';
import { useInvite } from '@/services/inviteService';
import { useSolana } from '@/contexts/SolanaProvider';
import { PublicKey } from '@solana/web3.js';

const InviteScreen = () => {
  const { publicKey, connection, signAndSendTransaction } = useSolana();
  const [code, setCode] = useState('');
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!publicKey || !connection || !signAndSendTransaction) return Alert.alert('Wallet not connected');
    if (!code || !group) return Alert.alert('Invite code and group address required');
    setLoading(true);
    try {
      await useInvite(
        connection,
        signAndSendTransaction,
        new PublicKey(group),
        publicKey,
        code
      );
      setLoading(false);
      Alert.alert('Success', 'Joined group via invite!');
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', e.message || 'Failed to redeem invite');
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background, padding: 24 }, cyberpunkStyles.animePanel]}>
      <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Redeem Group Invite</Text>
      <TextInput
        style={styles.input}
        placeholder="Invite Code"
        placeholderTextColor={theme.colors.textSecondary}
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Address (PDA)"
        placeholderTextColor={theme.colors.textSecondary}
        value={group}
        onChangeText={setGroup}
      />
      <TouchableOpacity
        style={[styles.button, cyberpunkStyles.neonBorder, loading && styles.disabledButton]}
        onPress={handleRedeem}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={theme.colors.white} /> : <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Redeem Invite</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.xxl,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.roundness,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  disabledButton: {
    opacity: 0.5,
  },
});

export default InviteScreen; 