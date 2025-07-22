// src/components/EscrowItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PublicKey } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';
import { theme } from '../theme';

interface EscrowItemProps {
  address: PublicKey;
  initiator: PublicKey;
  counterparty: PublicKey;
  initiatorToken: PublicKey;
  initiatorAmount: number;
  counterpartyToken: PublicKey;
  counterpartyAmount: number;
  status: number; // 0=pending, 1=accepted, 2=completed, 3=cancelled
  createdAt: number;
  expiresAt: number;
  initiatorTokenSymbol?: string;
  counterpartyTokenSymbol?: string;
  isUserInitiator: boolean;
}

const EscrowItem: React.FC<EscrowItemProps> = ({
  address,
  initiator,
  counterparty,
  initiatorToken,
  initiatorAmount,
  counterpartyToken,
  counterpartyAmount,
  status,
  createdAt,
  expiresAt,
  initiatorTokenSymbol = 'Unknown',
  counterpartyTokenSymbol = 'Unknown',
  isUserInitiator,
}) => {
  const navigation = useNavigation();
  
  const getStatusText = () => {
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
  
  const getStatusColor = () => {
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
  
  const handlePress = () => {
    // @ts-ignore - Navigation typing
    navigation.navigate('EscrowDetail', {
      escrowAddress: address.toString(),
    });
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        
        <Text style={styles.timeText}>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </Text>
      </View>
      
      <View style={styles.exchangeContainer}>
        <View style={styles.exchangeItem}>
          <Text style={styles.amountText}>
            {initiatorAmount} {initiatorTokenSymbol}
          </Text>
          <Text style={styles.partyText}>
            {isUserInitiator ? 'You offer' : 'They offer'}
          </Text>
        </View>
        
        <View style={styles.exchangeArrow}>
          <Ionicons name="swap-horizontal" size={24} color={theme.colors.textSecondary} />
        </View>
        
        <View style={styles.exchangeItem}>
          <Text style={styles.amountText}>
            {counterpartyAmount} {counterpartyTokenSymbol}
          </Text>
          <Text style={styles.partyText}>
            {isUserInitiator ? 'You receive' : 'They receive'}
          </Text>
        </View>
      </View>
      
      {status === 0 && (
        <View style={styles.footer}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.expiresText}>
            Expires {formatDistanceToNow(new Date(expiresAt), { addSuffix: true })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  exchangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exchangeItem: {
    flex: 1,
    alignItems: 'center',
  },
  exchangeArrow: {
    paddingHorizontal: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  partyText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiresText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});

export default EscrowItem;