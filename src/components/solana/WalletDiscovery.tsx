import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import getWallets from '@solana-mobile/wallet-standard-mobile';
import { WalletIcon } from '@wallet-standard/core';

interface WalletInfo {
  name: string;
  icon?: WalletIcon;
  readyState: string;
}

export const WalletDiscovery: React.FC = () => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const discoverWallets = async () => {
      try {
        const availableWallets = await getWallets();
        const list: any[] = Array.isArray(availableWallets) ? (availableWallets as any[]) : [];
        const walletInfos = list.map((wallet: any) => ({
          name: wallet.name,
          icon: wallet.icon,
          readyState: wallet.readyState,
        }));
        setWallets(walletInfos);
      } catch (error) {
        console.error('Failed to discover wallets:', error);
      } finally {
        setLoading(false);
      }
    };

    discoverWallets();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Discovering wallets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Wallets</Text>
      {wallets.map((wallet, index) => (
        <View key={index} style={styles.walletItem}>
          <Text style={styles.walletName}>{wallet.name}</Text>
          <Text style={styles.walletState}>{wallet.readyState}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  walletName: {
    fontSize: 16,
    fontWeight: '500',
  },
  walletState: {
    fontSize: 14,
    color: '#666',
  },
}); 