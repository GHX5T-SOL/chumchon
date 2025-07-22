// src/screens/details/EscrowDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicKey } from '@solana/web3.js';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthProvider';
import { Escrow, getEscrow, acceptEscrow, completeEscrow } from '../../services/escrowService';
import { shortenAddress } from '../../services/programService';

type EscrowDetailScreenRouteProp = RouteProp<MainStackParamList, 'EscrowDetail'>;
type EscrowDetailScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Token name mapping (in a real app, this would come from a token registry)
const TOKEN_NAMES: Record<string, string> = {
  'token1': 'SOL',
  'token2': 'USDC',
  'token3': 'BONK',
  'token4': 'RAY',
  'token5': 'SAMO',
  'token6': 'DUST',
  'token7': 'ORCA',
  'token8': 'MNGO',
};

const EscrowDetailScreen = () => {
  const route = useRoute<EscrowDetailScreenRouteProp>();
  const navigation = useNavigation<EscrowDetailScreenNavigationProp>();
  const { escrowAddress } = route.params;
  const { user } = useAuth();
  
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Load escrow
  useEffect(() => {
    const loadEscrow = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch the escrow from the blockchain
        const escrowData = await getEscrow(new PublicKey(escrowAddress));
        setEscrow(escrowData);
      } catch (error) {
        console.error('Failed to load escrow:', error);
        Alert.alert('Error', 'Failed to load escrow details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadEscrow();
  }, [escrowAddress]);

  // Get token name
  const getTokenName = (tokenAddress: string): string => {
    return TOKEN_NAMES[tokenAddress] || 'Unknown';
  };

  // Get status text
  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accepted';
      case 2:
        return 'Completed';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Get status color
  const getStatusColor = (status: number): string => {
    switch (status) {
      case 0:
        return theme.colors.warning;
      case 1:
        return theme.colors.info;
      case 2:
        return theme.colors.success;
      case 3:
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  // Format time remaining
  const formatTimeRemaining = (expiresAt: number): string => {
    const now = Date.now();
    const diff = expiresAt - now;
    
    if (diff <= 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} days, ${hours % 24} hours remaining`;
    }
    
    return `${hours} hours, ${minutes} minutes remaining`;
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  // Handle accept escrow
  const handleAcceptEscrow = async () => {
    if (!escrow || !user) return;
    
    setProcessing(true);
    try {
      await acceptEscrow(
        escrow.address,
        escrow.initiator,
        user.publicKey,
        escrow.createdAt
      );
      
      // Update local state
      setEscrow({
        ...escrow,
        status: 1, // Accepted
      });
      
      Alert.alert('Success', 'Escrow accepted successfully!');
    } catch (error) {
      console.error('Failed to accept escrow:', error);
      Alert.alert('Error', 'Failed to accept escrow. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle complete escrow
  const handleCompleteEscrow = async () => {
    if (!escrow || !user) return;
    
    setProcessing(true);
    try {
      await completeEscrow(
        escrow.address,
        escrow.initiator,
        escrow.counterparty,
        escrow.createdAt
      );
      
      // Update local state
      setEscrow({
        ...escrow,
        status: 2, // Completed
      });
      
      Alert.alert('Success', 'Escrow completed successfully!');
    } catch (error) {
      console.error('Failed to complete escrow:', error);
      Alert.alert('Error', 'Failed to complete escrow. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle cancel escrow
  const handleCancelEscrow = async () => {
    Alert.alert(
      'Cancel Escrow',
      'Are you sure you want to cancel this escrow?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            setProcessing(true);
            try {
              // In a real app, you would call the blockchain
              // For now, simulate cancelling
              
              // Update local state
              if (escrow) {
                setEscrow({
                  ...escrow,
                  status: 3, // Cancelled
                });
              }
              
              Alert.alert('Success', 'Escrow cancelled successfully!');
            } catch (error) {
              console.error('Failed to cancel escrow:', error);
              Alert.alert('Error', 'Failed to cancel escrow. Please try again.');
            } finally {
              setProcessing(false);
            }
          }
        },
      ]
    );
  };

  // Check if user is initiator
  const isInitiator = (): boolean => {
    if (!escrow || !user) return false;
    return escrow.initiator.toString() === user.publicKey.toString();
  };

  // Check if user is counterparty
  const isCounterparty = (): boolean => {
    if (!escrow || !user) return false;
    return escrow.counterparty.toString() === user.publicKey.toString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading escrow details...</Text>
      </View>
    );
  }

  if (!escrow) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load escrow details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escrow Details</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(escrow.status) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(escrow.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(escrow.status) }]}>
            {getStatusText(escrow.status)}
          </Text>
        </View>
        
        {escrow.status === 0 && (
          <Text style={styles.expiryText}>
            {formatTimeRemaining(escrow.expiresAt)}
          </Text>
        )}
      </View>
      
      {/* Parties */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parties</Text>
        
        <View style={styles.partyContainer}>
          <View style={styles.partyInfo}>
            <Text style={styles.partyLabel}>Initiator</Text>
            <Text style={styles.partyAddress}>
              {shortenAddress(escrow.initiator.toString())}
              {isInitiator() && <Text style={styles.youText}> (You)</Text>}
            </Text>
          </View>
          
          <Ionicons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
          
          <View style={styles.partyInfo}>
            <Text style={styles.partyLabel}>Counterparty</Text>
            <Text style={styles.partyAddress}>
              {shortenAddress(escrow.counterparty.toString())}
              {isCounterparty() && <Text style={styles.youText}> (You)</Text>}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Exchange Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exchange Details</Text>
        
        <View style={styles.exchangeContainer}>
          <View style={styles.exchangeSide}>
            <View style={styles.tokenContainer}>
              <Ionicons name="logo-usd" size={24} color={theme.colors.accent} />
              <Text style={styles.tokenAmount}>
                {escrow.initiatorAmount} {getTokenName(escrow.initiatorToken.toString())}
              </Text>
            </View>
            <Text style={styles.offerText}>
              {isInitiator() ? 'You offer' : 'They offer'}
            </Text>
          </View>
          
          <View style={styles.exchangeArrow}>
            <Ionicons name="swap-horizontal" size={32} color={theme.colors.accent} />
          </View>
          
          <View style={styles.exchangeSide}>
            <View style={styles.tokenContainer}>
              <Ionicons name="logo-usd" size={24} color={theme.colors.accent} />
              <Text style={styles.tokenAmount}>
                {escrow.counterpartyAmount} {getTokenName(escrow.counterpartyToken.toString())}
              </Text>
            </View>
            <Text style={styles.offerText}>
              {isCounterparty() ? 'You offer' : 'They offer'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Additional Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Created</Text>
          <Text style={styles.infoValue}>{formatDate(escrow.createdAt)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Expires</Text>
          <Text style={styles.infoValue}>{formatDate(escrow.expiresAt)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Group</Text>
          <Text style={styles.infoValue}>{shortenAddress(escrow.group.toString())}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Escrow ID</Text>
          <Text style={styles.infoValue}>{shortenAddress(escrow.address.toString())}</Text>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.actionsContainer}>
        {escrow.status === 0 && isCounterparty() && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAcceptEscrow}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.actionButtonText}>Accept Escrow</Text>
            )}
          </TouchableOpacity>
        )}
        
        {escrow.status === 1 && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleCompleteEscrow}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.actionButtonText}>Complete Exchange</Text>
            )}
          </TouchableOpacity>
        )}
        
        {escrow.status === 0 && isInitiator() && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelEscrow}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.actionButtonText}>Cancel Escrow</Text>
            )}
          </TouchableOpacity>
        )}
        
        {(escrow.status === 2 || escrow.status === 3) && (
          <View style={styles.completedMessage}>
            <Ionicons 
              name={escrow.status === 2 ? "checkmark-circle" : "close-circle"} 
              size={24} 
              color={escrow.status === 2 ? theme.colors.success : theme.colors.error} 
            />
            <Text style={[
              styles.completedText,
              { color: escrow.status === 2 ? theme.colors.success : theme.colors.error }
            ]}>
              {escrow.status === 2 ? "Exchange completed successfully" : "Exchange was cancelled"}
            </Text>
          </View>
        )}
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerRight: {
    width: 24, // To balance the header
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  expiryText: {
    fontSize: 14,
    color: theme.colors.warning,
  },
  section: {
    marginBottom: 24,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  partyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partyInfo: {
    flex: 1,
    alignItems: 'center',
  },
  partyLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  partyAddress: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  youText: {
    color: theme.colors.accent,
  },
  exchangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exchangeSide: {
    flex: 1,
    alignItems: 'center',
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  tokenAmount: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  offerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  exchangeArrow: {
    paddingHorizontal: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  acceptButton: {
    backgroundColor: theme.colors.info,
  },
  completeButton: {
    backgroundColor: theme.colors.success,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.colors.cardDark,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default EscrowDetailScreen;