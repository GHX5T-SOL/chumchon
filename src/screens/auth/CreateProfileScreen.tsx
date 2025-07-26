// src/screens/auth/CreateProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';
import { theme, commonStyles } from '@/theme';
import { shortenAddress } from '@/services/programService';
import { useNavigation } from '@react-navigation/native';

const CreateProfileScreen = () => {
  const { createProfile, isLoading } = useAuth();
  const { publicKey, authorizeSession, disconnect, network } = useSolana();
  const navigation = useNavigation();
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate username
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    } else if (username.length > 32) {
      setUsernameError('Username must be less than 32 characters');
      isValid = false;
    } else {
      setUsernameError(null);
    }
    
    // Validate bio
    if (bio.length > 256) {
      setBioError('Bio must be less than 256 characters');
      isValid = false;
    } else {
      setBioError(null);
    }
    
    return isValid;
  };

  // Handle reconnect wallet
  const handleReconnectWallet = async () => {
    console.log('[CreateProfile] Reconnecting wallet...');
    try {
      await disconnect();
      await authorizeSession();
      console.log('[CreateProfile] Wallet reconnected successfully');
    } catch (error) {
      console.error('[CreateProfile] Reconnect failed:', error);
      Alert.alert('Reconnect Error', error.message || 'Failed to reconnect wallet. Please try again.');
    }
  };

  // Handle clear wallet storage
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.removeItem('chumchon_wallet_auth');
      Alert.alert('Storage Cleared', 'Wallet storage has been cleared. Please restart the app and reconnect your wallet.');
    } catch (error) {
      console.error('[CreateProfile] Failed to clear storage:', error);
      Alert.alert('Error', 'Failed to clear storage. Please try again.');
    }
  };

  // Handle create profile
  const handleCreateProfile = async () => {
    console.log('[CreateProfile] Button pressed');
    if (!validateForm()) {
      console.log('[CreateProfile] Validation failed', { username, bio, usernameError, bioError });
      return;
    }
    console.log('[CreateProfile] Validation passed', { username, bio });
    try {
      console.log('[CreateProfile] About to call createProfile from useAuth:', { createProfile: typeof createProfile });
      console.log('[CreateProfile] Calling createProfile...');
      await createProfile(username, bio);
      console.log('[CreateProfile] createProfile success');
      // Do not manually navigate; let the root navigator handle the switch
    } catch (error) {
      console.error('[CreateProfile] Failed to create profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top bar with persistent wallet connect button */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>
          Set up your on-chain identity to start using Chumchon
        </Text>
        <Text style={styles.networkText}>Network: {network ?? 'Unknown'}</Text>
      </View>

      <View style={styles.formCentered}> {/* New style for centering */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, usernameError && styles.inputError]}
            placeholder="Enter a username"
            placeholderTextColor={theme.colors.muted}
            value={username}
            onChangeText={setUsername}
            maxLength={32}
          />
          {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
          {true && <Text style={styles.charCount}>{String(username.length)}/32</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput, bioError && styles.inputError]}
            placeholder="Tell us about yourself (optional)"
            placeholderTextColor={theme.colors.muted}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={256}
          />
          {bioError && <Text style={styles.errorText}>{bioError}</Text>}
          {true && <Text style={styles.charCount}>{String(bio.length)}/256</Text>}
        </View>

      </View>

      <View style={{ width: '100%', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { width: '100%' }]}
          onPress={handleCreateProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.buttonText}>Create Profile</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Your profile will be stored on the Solana blockchain and can be updated later.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  contentContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.accent,
    lineHeight: 24,
    textAlign: 'center',
  },
  networkText: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  walletInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  walletLabel: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  form: {
    marginBottom: 32,
  },
  formCentered: {
    marginBottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    ...commonStyles.input,
    height: 50,
    width: '100%',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
    width: '100%',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  charCount: {
    color: theme.colors.muted,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  button: {
    ...commonStyles.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.buttonPrimary,
    ...commonStyles.shadow,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...commonStyles.shadow,
  },
  buttonText: {
    ...commonStyles.buttonText,
  },
  secondaryButtonText: {
    ...commonStyles.buttonText,
    color: theme.colors.text,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: theme.colors.info + '20', // 20% opacity
    borderRadius: theme.roundness,
  },
  infoText: {
    color: theme.colors.info,
    fontSize: 14,
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
});

export default CreateProfileScreen;