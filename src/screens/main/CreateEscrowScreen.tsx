// src/screens/main/CreateEscrowScreen.tsx
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
  Switch,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@/navigation/AppNavigator';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { createEscrow } from '@/services/escrowService';
import { PublicKey } from '@solana/web3.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateEscrowScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Token options for dropdown
const TOKEN_OPTIONS = [
  { label: 'SOL', value: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana' },
  { label: 'USDC', value: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin' },
  { label: 'Enter CA', value: 'custom', symbol: 'CUSTOM', name: 'Custom Token' },
];

// Mock group options (in a real app, this would come from user's groups)
const GROUP_OPTIONS = [
  { address: 'group1', name: 'Crypto Traders' },
  { address: 'group2', name: 'NFT Collectors' },
  { address: 'group3', name: 'DeFi Enthusiasts' },
];

const CreateEscrowScreen = () => {
  const navigation = useNavigation<CreateEscrowScreenNavigationProp>();
  const { publicKey, connection, signAndSendTransaction } = useSolana();

  const [counterpartyAddress, setCounterpartyAddress] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [initiatorToken, setInitiatorToken] = useState('');
  const [initiatorAmount, setInitiatorAmount] = useState('');
  const [counterpartyToken, setCounterpartyToken] = useState('');
  const [counterpartyAmount, setCounterpartyAmount] = useState('');
  const [expirationHours, setExpirationHours] = useState('24');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dropdown states
  const [showInitiatorDropdown, setShowInitiatorDropdown] = useState(false);
  const [showCounterpartyDropdown, setShowCounterpartyDropdown] = useState(false);
  const [selectedInitiatorToken, setSelectedInitiatorToken] = useState<{ label: string; value: string; symbol: string; name: string } | null>(null);
  const [selectedCounterpartyToken, setSelectedCounterpartyToken] = useState<{ label: string; value: string; symbol: string; name: string } | null>(null);

  // Custom CA modal states
  const [showCustomCAModal, setShowCustomCAModal] = useState(false);
  const [customCA, setCustomCA] = useState('');
  const [customCASymbol, setCustomCASymbol] = useState('');
  const [isCustomCAForInitiator, setIsCustomCAForInitiator] = useState(true);

  // Validate form
  const validateForm = (): boolean => {
    if (!counterpartyAddress.trim()) {
      Alert.alert('Error', 'Please enter counterparty address');
      return false;
    }
    
    try {
      new PublicKey(counterpartyAddress);
    } catch {
      Alert.alert('Error', 'Please enter a valid Solana address');
      return false;
    }

    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a group');
      return false;
    }

    if (!selectedInitiatorToken) {
      Alert.alert('Error', 'Please select your token');
      return false;
    }

    if (!initiatorAmount || parseFloat(initiatorAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount for your token');
      return false;
    }

    if (!selectedCounterpartyToken) {
      Alert.alert('Error', 'Please select counterparty token');
      return false;
    }

    if (!counterpartyAmount || parseFloat(counterpartyAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount for counterparty token');
      return false;
    }

    if (initiatorToken === counterpartyToken) {
      Alert.alert('Error', 'You cannot trade the same token');
      return false;
    }

    if (!expirationHours || parseInt(expirationHours) < 1 || parseInt(expirationHours) > 168) {
      Alert.alert('Error', 'Expiration must be between 1 and 168 hours (7 days)');
      return false;
    }

    return true;
  };

  // Handle token selection
  const handleTokenSelection = (token: { label: string; value: string; symbol: string; name: string }, isInitiator: boolean) => {
    if (token.value === 'custom') {
      setIsCustomCAForInitiator(isInitiator);
      setShowCustomCAModal(true);
      if (isInitiator) {
        setShowInitiatorDropdown(false);
      } else {
        setShowCounterpartyDropdown(false);
      }
    } else {
      if (isInitiator) {
        setSelectedInitiatorToken(token);
        setInitiatorToken(token.value);
        setShowInitiatorDropdown(false);
      } else {
        setSelectedCounterpartyToken(token);
        setCounterpartyToken(token.value);
        setShowCounterpartyDropdown(false);
      }
    }
  };

  // Handle custom CA submission
  const handleCustomCASubmit = () => {
    if (!customCA.trim()) {
      Alert.alert('Error', 'Please enter a contract address');
      return;
    }

    try {
      new PublicKey(customCA);
    } catch {
      Alert.alert('Error', 'Please enter a valid Solana contract address');
      return;
    }

    const customToken = {
      label: customCASymbol || 'Custom Token',
      value: customCA,
      symbol: customCASymbol || 'CUSTOM',
      name: 'Custom Token'
    };

    if (isCustomCAForInitiator) {
      setSelectedInitiatorToken(customToken);
      setInitiatorToken(customCA);
    } else {
      setSelectedCounterpartyToken(customToken);
      setCounterpartyToken(customCA);
    }

    setShowCustomCAModal(false);
    setCustomCA('');
    setCustomCASymbol('');
  };

  // Handle create escrow
  const handleCreateEscrow = async () => {
    if (!validateForm()) return;
    if (!publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[CreateEscrow] Creating escrow with params:', {
        counterpartyAddress,
        selectedGroup,
        initiatorToken,
        initiatorAmount,
        counterpartyToken,
        counterpartyAmount,
        expirationHours
      });

      const expirationTime = Date.now() + (parseInt(expirationHours) * 60 * 60 * 1000);

      await createEscrow(
        connection,
        signAndSendTransaction,
        publicKey,
        new PublicKey(counterpartyAddress),
        new PublicKey(selectedGroup),
        new PublicKey(initiatorToken),
        parseFloat(initiatorAmount),
        new PublicKey(counterpartyToken),
        parseFloat(counterpartyAmount),
        expirationTime,
        new PublicKey('11111111111111111111111111111111'), // Dummy initiator token account
        new PublicKey('11111111111111111111111111111111')  // Dummy escrow token account
      );

      console.log('[CreateEscrow] Escrow created successfully');
      Alert.alert(
        'Success',
        'Escrow deal created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('[CreateEscrow] Failed to create escrow:', error);
      Alert.alert('Error', 'Failed to create escrow deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render dropdown item
  const renderDropdownItem = ({ item }: { item: { label: string; value: string; symbol: string; name: string } }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleTokenSelection(item, showInitiatorDropdown)}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Escrow Deal</Text>
          <Text style={styles.subtitle}>
            Set up a secure token exchange with another user
          </Text>
        </View>

        <View style={styles.form}>
          {/* Counterparty */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Counterparty Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Solana wallet address"
              placeholderTextColor={theme.colors.muted}
              value={counterpartyAddress}
              onChangeText={setCounterpartyAddress}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Group Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group</Text>
            <View style={styles.pickerContainer}>
              {GROUP_OPTIONS.map((group) => (
                <TouchableOpacity
                  key={group.address}
                  style={[
                    styles.pickerOption,
                    selectedGroup === group.address && styles.selectedOption
                  ]}
                  onPress={() => setSelectedGroup(group.address)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    selectedGroup === group.address && styles.selectedOptionText
                  ]}>
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Exchange Details */}
          <View style={styles.exchangeContainer}>
            <Text style={styles.sectionTitle}>Exchange Details</Text>
            
            {/* Your Side */}
            <View style={styles.exchangeSide}>
              <Text style={styles.sideLabel}>You Offer</Text>
              <View style={styles.tokenInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.0"
                  placeholderTextColor={theme.colors.muted}
                  value={initiatorAmount}
                  onChangeText={setInitiatorAmount}
                  keyboardType="numeric"
                />
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowInitiatorDropdown(!showInitiatorDropdown)}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {selectedInitiatorToken ? selectedInitiatorToken.label : 'Select Token'}
                    </Text>
                    <Icon 
                      name={showInitiatorDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme.colors.accent} 
                    />
                  </TouchableOpacity>
                  
                  {showInitiatorDropdown && (
                    <View style={styles.dropdownList}>
                      <FlatList
                        data={TOKEN_OPTIONS}
                        renderItem={renderDropdownItem}
                        keyExtractor={(item) => item.value}
                        style={styles.dropdownFlatList}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Exchange Arrow */}
            <View style={styles.exchangeArrow}>
              <Icon name="swap-horizontal" size={24} color={theme.colors.accent} />
            </View>

            {/* Counterparty Side */}
            <View style={styles.exchangeSide}>
              <Text style={styles.sideLabel}>You Receive</Text>
              <View style={styles.tokenInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.0"
                  placeholderTextColor={theme.colors.muted}
                  value={counterpartyAmount}
                  onChangeText={setCounterpartyAmount}
                  keyboardType="numeric"
                />
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowCounterpartyDropdown(!showCounterpartyDropdown)}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {selectedCounterpartyToken ? selectedCounterpartyToken.label : 'Select Token'}
                    </Text>
                    <Icon 
                      name={showCounterpartyDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme.colors.accent} 
                    />
                  </TouchableOpacity>
                  
                  {showCounterpartyDropdown && (
                    <View style={styles.dropdownList}>
                      <FlatList
                        data={TOKEN_OPTIONS}
                        renderItem={({ item }) => renderDropdownItem({ item })}
                        keyExtractor={(item) => item.value}
                        style={styles.dropdownFlatList}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Advanced Options */}
          <View style={styles.advancedContainer}>
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <Text style={styles.advancedToggleText}>Advanced Options</Text>
              <Icon 
                name={showAdvanced ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.accent} 
              />
            </TouchableOpacity>

            {showAdvanced && (
              <View style={styles.advancedContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Expiration Time (hours)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="24"
                    placeholderTextColor={theme.colors.muted}
                    value={expirationHours}
                    onChangeText={setExpirationHours}
                    keyboardType="numeric"
                  />
                  <Text style={styles.helperText}>
                    Escrow will expire after this time if not accepted
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="shield-check-outline" size={20} color={theme.colors.success} />
              <Text style={styles.infoText}>
                Your tokens are held securely in escrow until the deal is completed
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="clock-outline" size={20} color={theme.colors.warning} />
              <Text style={styles.infoText}>
                The counterparty has {expirationHours || 24} hours to accept the deal
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="information-outline" size={20} color={theme.colors.accent} />
              <Text style={styles.infoText}>
                You can cancel the escrow anytime before it's accepted
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Custom CA Modal */}
      <Modal
        visible={showCustomCAModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomCAModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Custom Contract Address</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contract Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Solana contract address"
                placeholderTextColor={theme.colors.muted}
                value={customCA}
                onChangeText={setCustomCA}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Token Symbol (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., BONK, RAY"
                placeholderTextColor={theme.colors.muted}
                value={customCASymbol}
                onChangeText={setCustomCASymbol}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={10}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowCustomCAModal(false);
                  setCustomCA('');
                  setCustomCASymbol('');
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleCustomCASubmit}
              >
                <Text style={styles.confirmModalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
          onPress={handleCreateEscrow}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.createButtonText}>Create Escrow</Text>
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
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  pickerOptionText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedOptionText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  exchangeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  exchangeSide: {
    marginBottom: 16,
  },
  sideLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  tokenInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: theme.colors.text, // Ensure white text
    flex: 1,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 1000,
    maxHeight: 150,
    marginTop: 4,
  },
  dropdownFlatList: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.colors.text, // Ensure white text
  },
  exchangeArrow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  advancedContainer: {
    marginBottom: 24,
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  advancedToggleText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  advancedContent: {
    marginTop: 12,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelModalButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalButton: {
    backgroundColor: theme.colors.accent,
  },
  confirmModalButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
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

export default CreateEscrowScreen; 