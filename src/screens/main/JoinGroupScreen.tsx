// src/screens/main/JoinGroupScreen.tsx
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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { useInvite } from '@/services/inviteService';
import { PublicKey } from '@solana/web3.js';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type JoinGroupScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const JoinGroupScreen = () => {
  const navigation = useNavigation<JoinGroupScreenNavigationProp>();
  const { publicKey, connection, signAndSendTransaction } = useSolana();
  
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return false;
    }
    if (inviteCode.length < 3) {
      Alert.alert('Error', 'Invite code must be at least 3 characters');
      return false;
    }
    return true;
  };

  // Handle join group with invite
  const handleJoinGroup = async () => {
    if (!validateForm()) return;
    if (!publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[JoinGroup] Joining group with invite code:', inviteCode);

      // For now, we'll use a dummy group address since the invite code should contain the group info
      // In a real implementation, the invite code would be decoded to get the group address
      const dummyGroupAddress = new PublicKey('11111111111111111111111111111111');
      
      await useInvite(
        connection,
        signAndSendTransaction,
        dummyGroupAddress,
        publicKey,
        inviteCode
      );

      console.log('[JoinGroup] Successfully joined group with invite');
      Alert.alert(
        'Success', 
        'Successfully joined the group!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('[JoinGroup] Failed to join group:', error);
      Alert.alert('Error', 'Failed to join group. Please check your invite code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scan QR code (placeholder for future implementation)
  const handleScanQRCode = () => {
    Alert.alert('QR Scanner', 'QR code scanning will be implemented in a future update.');
  };

  // Handle paste from clipboard (placeholder for future implementation)
  const handlePasteFromClipboard = () => {
    Alert.alert('Clipboard', 'Clipboard functionality will be implemented in a future update.');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Group with Invite</Text>
          <Text style={styles.subtitle}>
            Enter an invite code to join a group or channel
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Invite Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter invite code (e.g., ABC123)"
              placeholderTextColor={theme.colors.muted}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={32}
            />
            <Text style={styles.charCount}>{inviteCode.length}/32</Text>
          </View>

          <View style={styles.helperButtons}>
            <TouchableOpacity 
              style={styles.helperButton} 
              onPress={handleScanQRCode}
            >
              <Icon name="qrcode-scan" size={20} color={theme.colors.accent} />
              <Text style={styles.helperButtonText}>Scan QR Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.helperButton} 
              onPress={handlePasteFromClipboard}
            >
              <Icon name="content-paste" size={20} color={theme.colors.accent} />
              <Text style={styles.helperButtonText}>Paste</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icon name="information-outline" size={20} color={theme.colors.accent} />
            <Text style={styles.infoText}>
              Invite codes are case-sensitive and can only be used once
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="shield-check-outline" size={20} color={theme.colors.success} />
            <Text style={styles.infoText}>
              Groups may have requirements like minimum SOL balance or specific tokens
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="clock-outline" size={20} color={theme.colors.warning} />
            <Text style={styles.infoText}>
              Some invite codes may expire after a certain time
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.joinButton, isLoading && styles.disabledButton]}
          onPress={handleJoinGroup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.joinButtonText}>Join Group</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100, // Space for buttons
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
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '600',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    textAlign: 'right',
    marginTop: 4,
  },
  helperButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  helperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  helperButtonText: {
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: 8,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    marginLeft: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 16,
    padding: 24,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
  joinButton: {
    backgroundColor: theme.colors.accent,
  },
  joinButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default JoinGroupScreen; 