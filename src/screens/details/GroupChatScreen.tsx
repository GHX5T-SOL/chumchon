// src/screens/details/GroupChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicKey } from '@solana/web3.js';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { theme, cyberpunkStyles } from '../../theme';
import { useAuth } from '../../contexts/AuthProvider';
import { Message, getGroupMessages } from '../../services/messageService';
import GroupHeader from '../../components/GroupHeader';
import MessageItem from '../../components/MessageItem';
import MessageInput from '../../components/MessageInput';
import { format } from 'date-fns';

type GroupChatScreenRouteProp = RouteProp<MainStackParamList, 'GroupChat'>;
type GroupChatScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock data for user profiles
const MOCK_USER_PROFILES: Record<string, { username: string, profilePic?: string }> = {
  'user1': { username: 'SolanaWhale', profilePic: 'https://example.com/profile1.jpg' },
  'user2': { username: 'CryptoNinja', profilePic: 'https://example.com/profile2.jpg' },
  'user3': { username: 'BlockchainDev', profilePic: 'https://example.com/profile3.jpg' },
  'user4': { username: 'TokenMaster', profilePic: 'https://example.com/profile4.jpg' },
};

const GroupChatScreen = () => {
  const route = useRoute<GroupChatScreenRouteProp>();
  const navigation = useNavigation<GroupChatScreenNavigationProp>();
  const { 
    groupAddress, 
    groupName, 
    groupDescription, 
    memberCount, 
    isChannel,
    creator 
  } = route.params;
  
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch messages from the blockchain
        const groupMessages = await getGroupMessages(new PublicKey(groupAddress));
        setMessages(groupMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        Alert.alert('Error', 'Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up polling for new messages
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [groupAddress]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Handle message sent
  const handleMessageSent = async () => {
    try {
      // Refresh messages
      const groupMessages = await getGroupMessages(new PublicKey(groupAddress));
      setMessages(groupMessages);
      
      // Scroll to bottom
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  };

  // Show group info
  const handleShowInfo = () => {
    // Navigate to group info screen
    Alert.alert('Group Info', 'Group info screen not implemented yet');
  };

  // Show invite screen
  const handleShowInvite = () => {
    // Navigate to invite screen
    Alert.alert('Invite', 'Invite screen not implemented yet');
  };

  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isOwnMessage = user?.publicKey.toString() === item.sender.toString();
    const senderKey = item.sender.toString();
    
    // Get mock user profile for the sender
    const mockProfile = MOCK_USER_PROFILES[senderKey] || { 
      username: isOwnMessage ? 'You' : 'Unknown User' 
    };
    
    return (
      <MessageItem
        address={item.address}
        group={item.group}
        sender={item.sender}
        messageId={item.messageId}
        content={item.content}
        timestamp={item.timestamp}
        tipAmount={item.tipAmount}
        senderUsername={mockProfile.username}
        senderProfilePic={mockProfile.profilePic}
      />
    );
  };

  // Render date separator
  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.dateLine} />
    </View>
  );

  // Get items with date separators
  const getItemsWithDateSeparators = () => {
    if (messages.length === 0) return [];
    
    const items: (Message | { id: string, type: 'separator', date: string })[] = [];
    let currentDate = '';
    
    messages.forEach(message => {
      const messageDate = format(new Date(message.timestamp), 'MMMM d, yyyy');
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        items.push({
          id: `separator-${currentDate}`,
          type: 'separator',
          date: currentDate,
        });
      }
      
      items.push(message);
    });
    
    return items;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <GroupHeader
        name={groupName}
        description={groupDescription}
        memberCount={memberCount}
        isChannel={isChannel}
        onInfoPress={handleShowInfo}
        onInvitePress={handleShowInvite}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={getItemsWithDateSeparators()}
          renderItem={({ item }) => {
            if ('type' in item && item.type === 'separator') {
              return renderDateSeparator(item.date);
            }
            return renderMessageItem({ item: item as Message });
          }}
          keyExtractor={item => 
            'type' in item ? item.id : item.address.toString()
          }
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Be the first to send a message!</Text>
            </View>
          }
        />
      )}
      
      <MessageInput
        group={new PublicKey(groupAddress)}
        creator={new PublicKey(creator)}
        name={groupName}
        onMessageSent={handleMessageSent}
      />
      <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('Tip', { groupAddress })}>
        <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Tip Group Member</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  messageList: {
    padding: 16,
    paddingBottom: 16,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginHorizontal: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GroupChatScreen;