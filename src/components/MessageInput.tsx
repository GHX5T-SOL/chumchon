// src/components/MessageInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';
import { sendMessage } from '@/services/messageService';
import { theme } from '@/theme';

interface MessageInputProps {
  group: PublicKey;
  creator: PublicKey;
  name: string;
  onMessageSent: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  group,
  creator,
  name,
  onMessageSent,
}) => {
  const { user } = useAuth();
  const { connection, signAndSendTransaction } = useSolana();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!user || !message.trim() || !connection || !signAndSendTransaction) {
      return;
    }
    
    try {
      setIsSending(true);
      Keyboard.dismiss();
      
      await sendMessage(
        connection,
        signAndSendTransaction,
        group,
        user.publicKey,
        message.trim()
      );
      
      // Clear the input
      setMessage('');
      
      // Notify parent component
      onMessageSent();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor={theme.colors.textSecondary}
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={1024}
        editable={!isSending}
      />
      
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!message.trim() || isSending) && styles.disabledButton
        ]}
        onPress={handleSend}
        disabled={!message.trim() || isSending}
      >
        {isSending ? (
          <ActivityIndicator size="small" color={theme.colors.white} />
        ) : (
          <Ionicons name="send" size={24} color={theme.colors.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
});

export default MessageInput;