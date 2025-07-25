import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { theme } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { ellipsify } from '../../utils/ellipsify';

export function WalletConnectButton() {
  const { account, connect, disconnect } = useWalletUi();
  const isConnected = !!account;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={isConnected ? disconnect : connect}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
    >
      <View style={styles.innerRow}>
        <Ionicons
          name={isConnected ? 'wallet' : 'log-in-outline'}
          size={20}
          color={theme.colors.accent}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>
          {isConnected
            ? ellipsify(account.publicKey?.toString() || '', 4)
            : 'Connect Wallet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadow,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
  },
}); 