// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles } from '@/theme';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuth();
  const { connected, connecting } = useSolana();
  const [error, setError] = useState<string | null>(null);

  // Handle login
  const handleLogin = async () => {
    try {
      setError(null);
      await login();
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error(err);
    }
  };

  // If already connected, navigate to create profile
  useEffect(() => {
    if (connected && !isLoading) {
      navigation.navigate('CreateProfile');
    }
  }, [connected, isLoading, navigation]);

  return (
    <View style={styles.container}>
      {/* Top bar with Connect Wallet button on the right */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.content}>
        <Icon name="wallet" size={80} color={theme.colors.accent} style={styles.icon} />
        <Text style={styles.title}>Connect Your Wallet</Text>
        <Text style={styles.description}>
          Connect your Solana wallet to access Chumchon's decentralized social features.
        </Text>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.walletOptions}>
          <Text style={styles.walletOptionsTitle}>Supported Wallets:</Text>
          <View style={styles.walletList}>
            <WalletOption name="Phantom" />
            <WalletOption name="Solflare" />
            <WalletOption name="Backpack" />
            <WalletOption name="Glow" />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

interface WalletOptionProps {
  name: string;
}

const WalletOption = ({ name }: WalletOptionProps) => (
  <View style={styles.walletOption}>
    <Text style={styles.walletName}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20', // 20% opacity
    padding: 16,
    borderRadius: theme.roundness,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
  },
  button: {
    ...commonStyles.button,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.colors.buttonPrimary,
    ...commonStyles.shadow,
  },
  buttonText: {
    ...commonStyles.buttonText,
  },
  walletOptions: {
    marginTop: 32,
    width: '100%',
  },
  walletOptionsTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  walletList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  walletOption: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  walletName: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  connectButton: {
    backgroundColor: theme.colors.buttonPrimary,
    borderRadius: theme.roundness,
    paddingVertical: 8,
    paddingHorizontal: 18,
    ...commonStyles.shadow,
  },
  connectButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;