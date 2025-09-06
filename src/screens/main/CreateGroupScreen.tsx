// src/screens/main/CreateGroupScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { createGroup } from '@/services/groupService';
import { PublicKey } from '@solana/web3.js';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type CreateGroupScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CreateGroupScreen = () => {
  const navigation = useNavigation<CreateGroupScreenNavigationProp>();
  const { publicKey, connection, signAndSendTransaction } = useSolana();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isChannel, setIsChannel] = useState(false);
  const [isWhaleGroup, setIsWhaleGroup] = useState(false);
  const [requiredSolBalance, setRequiredSolBalance] = useState('');
  const [requiredTokenAddress, setRequiredTokenAddress] = useState('');
  const [requiredTokenAmount, setRequiredTokenAmount] = useState('');
  const [requiredNftCollection, setRequiredNftCollection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Group name is required');
      return false;
    }
    if (name.length < 3) {
      Alert.alert('Error', 'Group name must be at least 3 characters');
      return false;
    }
    if (name.length > 32) {
      Alert.alert('Error', 'Group name must be less than 32 characters');
      return false;
    }
    if (description.length > 256) {
      Alert.alert('Error', 'Description must be less than 256 characters');
      return false;
    }
    if (isWhaleGroup && !requiredSolBalance) {
      Alert.alert('Error', 'Whale groups require a minimum SOL balance');
      return false;
    }
    if (requiredSolBalance && parseFloat(requiredSolBalance) <= 0) {
      Alert.alert('Error', 'Required SOL balance must be greater than 0');
      return false;
    }
    if (requiredTokenAddress && !requiredTokenAmount) {
      Alert.alert('Error', 'Token amount is required when token address is specified');
      return false;
    }
    if (requiredTokenAmount && parseFloat(requiredTokenAmount) <= 0) {
      Alert.alert('Error', 'Required token amount must be greater than 0');
      return false;
    }
    return true;
  };

  // Handle create group
  const handleCreateGroup = async () => {
    if (!validateForm()) return;
    if (!publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[CreateGroup] Creating group with params:', {
        name,
        description,
        isChannel,
        isWhaleGroup,
        requiredSolBalance: parseFloat(requiredSolBalance) || 0,
        requiredTokenAddress,
        requiredTokenAmount: parseFloat(requiredTokenAmount) || 0,
        requiredNftCollection,
      });

      const group = await createGroup(
        connection,
        signAndSendTransaction,
        publicKey,
        name,
        description,
        isChannel,
        isWhaleGroup,
        requiredTokenAddress ? new PublicKey(requiredTokenAddress) : undefined,
        parseFloat(requiredTokenAmount) || 0,
        requiredNftCollection ? new PublicKey(requiredNftCollection) : undefined,
        parseFloat(requiredSolBalance) || 0
      );

      console.log('[CreateGroup] Group created successfully:', group);
      Alert.alert(
        'Success', 
        'Group created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('[CreateGroup] Failed to create group:', error);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Group</Text>
        <Text style={styles.subtitle}>
          Set up your group settings and requirements
        </Text>
      </View>

      <View style={styles.form}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor={theme.colors.muted}
              value={name}
              onChangeText={setName}
              maxLength={32}
            />
            <Text style={styles.charCount}>{name.length}/32</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your group (optional)"
              placeholderTextColor={theme.colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={256}
            />
            <Text style={styles.charCount}>{description.length}/256</Text>
          </View>
        </View>

        {/* Group Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Type</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Icon name="bullhorn" size={20} color={theme.colors.accent} />
              <Text style={styles.switchLabel}>Channel (Broadcast only)</Text>
              <Switch
                value={isChannel}
                onValueChange={setIsChannel}
                trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                thumbColor={theme.colors.text}
              />
            </View>
            <Text style={styles.switchDescription}>
              Channels are for announcements and broadcasts only
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Icon name="currency-usd" size={20} color={theme.colors.warning} />
              <Text style={styles.switchLabel}>Whale Group</Text>
              <Switch
                value={isWhaleGroup}
                onValueChange={setIsWhaleGroup}
                trackColor={{ false: theme.colors.border, true: theme.colors.warning }}
                thumbColor={theme.colors.text}
              />
            </View>
            <Text style={styles.switchDescription}>
              Whale groups require minimum SOL balance to join
            </Text>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Requirements</Text>
          
          {isWhaleGroup && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Minimum SOL Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor={theme.colors.muted}
                value={requiredSolBalance}
                onChangeText={setRequiredSolBalance}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Required Token Address (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Token mint address"
              placeholderTextColor={theme.colors.muted}
              value={requiredTokenAddress}
              onChangeText={setRequiredTokenAddress}
            />
          </View>

          {requiredTokenAddress && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Required Token Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={theme.colors.muted}
                value={requiredTokenAmount}
                onChangeText={setRequiredTokenAmount}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Required NFT Collection (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="NFT collection address"
              placeholderTextColor={theme.colors.muted}
              value={requiredNftCollection}
              onChangeText={setRequiredNftCollection}
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.createButton, isLoading && styles.disabledButton]}
          onPress={handleCreateGroup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.createButtonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
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
    color: theme.colors.text, // Changed from theme.colors.muted to white
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    textAlign: 'right',
    marginTop: 4,
  },
  switchContainer: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  switchDescription: {
    fontSize: 14,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    marginLeft: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: theme.roundness,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: theme.colors.accent,
  },
  createButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CreateGroupScreen; 