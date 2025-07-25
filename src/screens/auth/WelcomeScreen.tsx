// src/screens/auth/WelcomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';

// Type the navigation prop for correct route names
// (If you get a type error, make sure AuthStackParamList is correct)
type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { login, isLoading, userProfile } = useAuth();
  const { connected } = useSolana();
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Removed the redundant title */}
        <Text style={styles.subtitle}>Decentralized Social Network Built on Solana</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featureListItem}>🧑🎨  User Profiles: Create and customize your on-chain profile with NFT profile pictures</Text>
        <Text style={styles.featureListItem}>🔒  Token-Gated Groups: Create and join exclusive communities based on token or NFT ownership</Text>
        <Text style={styles.featureListItem}>💬  Messaging System: Send messages in groups and tip content creators with SOL or SPL Tokens</Text>
        <Text style={styles.featureListItem}>🤝  Escrow System: Securely trade tokens with other users through on-chain escrow in "Whale Groups"</Text>
        <Text style={styles.featureListItem}>🔗  Invite System: Generate and share invite links to bring friends into groups</Text>
        <Text style={styles.featureListItem}>🖼️  Meme Challenges: Create AI-powered meme contests with SOL or token rewards</Text>
        <Text style={styles.featureListItem}>🎓  Educational Rewards: Complete tutorials to earn SOL or token rewards</Text>
      </View>

      <View style={[styles.buttonContainer, { marginBottom: 64 }]}>
        <TouchableOpacity
          style={[styles.button, cyberpunkStyles.neonBorder, { marginBottom: 12 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, cyberpunkStyles.neonBorder]}
          onPress={() => navigation.navigate('CreateProfile')}
        >
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    {/* Only use valid MaterialCommunityIcons names */}
    <Icon name={icon as any} size={24} color={theme.colors.accent} />
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.accent,
    marginBottom: 24,
  },
  featuresContainer: {
    marginVertical: 32,
    width: '90%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: theme.colors.accent, // changed from theme.colors.muted
  },
  buttonContainer: {
    marginBottom: 64,
  },
  button: {
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.buttonPrimary,
    ...commonStyles.shadow,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureListItem: {
    fontSize: 16,
    color: theme.colors.accent,
    marginBottom: 14,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});

export default WelcomeScreen;