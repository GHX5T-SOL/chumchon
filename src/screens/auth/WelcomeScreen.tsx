// src/screens/auth/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '../../theme';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// Type the navigation prop for correct route names
// (If you get a type error, make sure AuthStackParamList is correct)
type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>CHUMCHON</Text>
        <Text style={styles.subtitle}>Decentralized Social on Solana</Text>
      </View>

      <View style={styles.featuresContainer}>
        <FeatureItem
          icon="account-group"
          title="Token-Gated Communities"
          description="Join exclusive groups with your NFTs and tokens"
        />
        <FeatureItem
          icon="message-text"
          title="On-Chain Messaging"
          description="Chat securely with cryptographic verification"
        />
        <FeatureItem
          icon="swap-horizontal"
          title="Secure Escrow"
          description="Trade tokens safely with built-in escrow"
        />
        <FeatureItem
          icon="image-multiple"
          title="Meme Challenges"
          description="Create and vote on AI-powered meme contests"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, cyberpunkStyles.neonBorder]}
          onPress={() => navigation.navigate('CreateProfile')}
        >
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Start Onboarding</Text>
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
    width: 120,
    height: 120,
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
    marginBottom: 32,
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
});

export default WelcomeScreen;