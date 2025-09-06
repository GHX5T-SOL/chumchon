// src/components/MessageItem.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthProvider';
import { tipMessage } from '@/services/messageService';
import { useSolana } from '@/contexts/SolanaProvider';
import { theme } from '@/theme';

interface MessageItemProps {
  address: PublicKey;
  group: PublicKey;
  sender: PublicKey;
  messageId: number;
  content: string;
  timestamp: number;
  tipAmount: number;
  senderUsername?: string;
  senderProfilePic?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  address,
  group,
  sender,
  messageId,
  content,
  timestamp,
  tipAmount,
  senderUsername = 'Anonymous',
  senderProfilePic,
}) => {
  const { userProfile } = useAuth();
  const { connection, signAndSendTransaction } = useSolana();
  const [localTipAmount, setLocalTipAmount] = useState(tipAmount);
  const [isTipping, setIsTipping] = useState(false);

  const isCurrentUser = false;

  const handleTip = async () => {
    if (!connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Wallet not connected');
      return;
    }

    try {
      setIsTipping(true);
      
      // Default tip amount is 0.01 SOL (10,000,000 lamports)
      const tipAmount = 10000000;
      
      await tipMessage(
        connection,
        signAndSendTransaction,
        address,
        new PublicKey('11111111111111111111111111111111'),
        sender,
        group,
        messageId,
        tipAmount
      );
      
      // Update the local tip amount
      setLocalTipAmount(prevAmount => prevAmount + tipAmount);
      
      Alert.alert('Success', 'Tip sent successfully!');
    } catch (error) {
      console.error('Failed to tip message:', error);
      Alert.alert('Error', 'Failed to send tip. Please try again.');
    } finally {
      setIsTipping(false);
    }
  };
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isCurrentUser && (
        <View style={styles.avatarContainer}>
          {senderProfilePic ? (
            <Image source={{ uri: senderProfilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.defaultAvatarText}>{senderUsername.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={[
        styles.messageContent,
        isCurrentUser ? styles.currentUserContent : styles.otherUserContent
      ]}>
        {!isCurrentUser && (
          <Text style={styles.username}>{senderUsername}</Text>
        )}
        
        <Text style={styles.message}>{content}</Text>
        
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </Text>
          
          {localTipAmount > 0 && (
            <View style={styles.tipContainer}>
              <Text style={styles.tipAmount}>
                {(localTipAmount / 1000000000).toFixed(4)} SOL
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {!isCurrentUser && (
        <TouchableOpacity
          style={styles.tipButton}
          onPress={handleTip}
          disabled={isTipping}
        >
          <Text style={styles.tipButtonText}>🎁</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContent: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 12,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserContent: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserContent: {
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 4,
  },
  username: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  message: {
    color: theme.colors.text,
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  timestamp: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipAmount: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipButtonText: {
    fontSize: 18,
  },
});

export default MessageItem;