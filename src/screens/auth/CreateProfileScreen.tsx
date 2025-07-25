// src/screens/auth/CreateProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';
import { theme, commonStyles } from '@/theme';
import { shortenAddress } from '@/services/programService';
import { useNavigation } from '@react-navigation/native';

const CreateProfileScreen = () => {
  const { createProfile, isLoading } = useAuth();
  const { publicKey } = useSolana();
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

  // Handle create profile
  const handleCreateProfile = async () => {
    console.log('[CreateProfile] Button pressed');
    if (!validateForm()) {
      console.log('[CreateProfile] Validation failed', { username, bio, usernameError, bioError });
      return;
    }
    console.log('[CreateProfile] Validation passed', { username, bio });
    try {
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
      </View>

      {/* Removed walletInfo box */}

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
          <Text style={styles.charCount}>{username.length}/32</Text>
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
          <Text style={styles.charCount}>{bio.length}/256</Text>
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
  buttonText: {
    ...commonStyles.buttonText,
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