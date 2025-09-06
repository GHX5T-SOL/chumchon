// src/screens/main/MessagesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Modal, Alert } from 'react-native';
import { AppPage } from '@/components/app-page'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { useAuth } from '@/contexts/AuthProvider';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type MessagesScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Message interface
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
}

// Conversation interface
interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  lastSeen: Date;
}

// User interface
interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  publicKey: string;
  isOnline: boolean;
}

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'crypto_whale',
    displayName: 'Crypto Whale',
    avatar: '🐋',
    publicKey: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    isOnline: true,
  },
  {
    id: '2',
    username: 'solana_dev',
    displayName: 'Solana Dev',
    avatar: '👨‍💻',
    publicKey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    isOnline: false,
  },
  {
    id: '3',
    username: 'nft_collector',
    displayName: 'NFT Collector',
    avatar: '🎨',
    publicKey: '3xNweLHLqrxmofjL3XrTgH1vJqS9V8bK2mN4pQ7rT9yU',
    isOnline: true,
  },
  {
    id: '4',
    username: 'defi_trader',
    displayName: 'DeFi Trader',
    avatar: '📈',
    publicKey: '5kL8mN2pQ7rT9yU3xNweLHLqrxmofjL3XrTgH1vJqS9V',
    isOnline: false,
  },
];

// Mock conversations data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participant: MOCK_USERS[0],
    lastMessage: {
      id: 'msg1',
      senderId: '1',
      receiverId: 'current_user',
      content: 'Hey! How\'s the trading going? I saw you made some great moves on SOL!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      messageType: 'text',
    },
    unreadCount: 2,
    isOnline: true,
    lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    participant: MOCK_USERS[1],
    lastMessage: {
      id: 'msg2',
      senderId: 'current_user',
      receiverId: '2',
      content: 'Thanks for the help with the smart contract! The deployment went smoothly.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
      messageType: 'text',
    },
    unreadCount: 0,
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
];

const MessagesScreen = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const { publicKey } = useSolana();
  const { userProfile } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessageContent, setNewMessageContent] = useState('');

  // Filter conversations by search
  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conv =>
        conv.participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [conversations, searchQuery]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Update online status randomly
      setConversations(prev => prev.map(conv => ({
        ...conv,
        participant: {
          ...conv.participant,
          isOnline: Math.random() > 0.5,
        },
      })));
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle new message
  const handleNewMessage = () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to message');
      return;
    }
    
    if (!newMessageContent.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    // Create new conversation or update existing
    const existingConversation = conversations.find(conv => conv.participant.id === selectedUser.id);
    
    if (existingConversation) {
      // Update existing conversation
      setConversations(prev => prev.map(conv => 
        conv.id === existingConversation.id 
          ? {
              ...conv,
              lastMessage: {
                id: `msg_${Date.now()}`,
                senderId: 'current_user',
                receiverId: selectedUser.id,
                content: newMessageContent,
                timestamp: new Date(),
                isRead: false,
                messageType: 'text',
              },
              unreadCount: 0,
            }
          : conv
      ));
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        participant: selectedUser,
        lastMessage: {
          id: `msg_${Date.now()}`,
          senderId: 'current_user',
          receiverId: selectedUser.id,
          content: newMessageContent,
          timestamp: new Date(),
          isRead: false,
          messageType: 'text',
        },
        unreadCount: 0,
        isOnline: selectedUser.isOnline,
        lastSeen: new Date(),
      };
      
      setConversations(prev => [newConversation, ...prev]);
    }

    setNewMessageContent('');
    setSelectedUser(null);
    setShowNewMessageModal(false);
  };

  // Handle conversation press
  const handleConversationPress = (conversation: Conversation) => {
    // Navigate to chat detail screen (would be implemented separately)
    Alert.alert(
      'Chat with ' + conversation.participant.displayName,
      'This would open the detailed chat screen with ' + conversation.participant.displayName
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Render conversation item
  const renderConversationItem = ({ item, index }: { item: Conversation; index: number }) => (
    <TouchableOpacity 
      accessibilityRole="button"
      accessibilityLabel={`Open conversation with ${item.participant.displayName}`}
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.participant.avatar}</Text>
        {item.participant.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>{item.participant.displayName}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.lastMessage.timestamp)}</Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text 
            style={[
              styles.lastMessage,
              !item.lastMessage.isRead && item.lastMessage.senderId !== 'current_user' && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.senderId === 'current_user' ? 'You: ' : ''}
            {item.lastMessage.content}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render user item for new message modal
  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </View>
      
      {selectedUser?.id === item.id && (
        <Icon name="check-circle" size={20} color={theme.colors.accent} />
      )}
    </TouchableOpacity>
  );

  return (
    <AppPage>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Private conversations with other users</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* New Message Button */}
      <View style={styles.newMessageContainer}>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={() => setShowNewMessageModal(true)}
        >
          <Icon name="plus" size={20} color={theme.colors.background} />
          <Text style={styles.newMessageText}>New Message</Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={({ item, index }) => renderConversationItem({ item, index })}
          keyExtractor={(item) => item.id}
          initialNumToRender={12}
          windowSize={13}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.accent]}
              tintColor={theme.colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="message-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Messages</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'No conversations found matching your search.' : 'Start a conversation with other users!'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              style={styles.startConversationButton}
              onPress={() => setShowNewMessageModal(true)}
            >
              <Text style={styles.startConversationText}>Start a Conversation</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* New Message Modal */}
      <Modal
        visible={showNewMessageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNewMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setShowNewMessageModal(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {!selectedUser ? (
              <FlatList
                data={MOCK_USERS}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.messageInputContainer}>
                <View style={styles.selectedUserInfo}>
                  <Text style={styles.avatar}>{selectedUser.avatar}</Text>
                  <View>
                    <Text style={styles.selectedUserName}>{selectedUser.displayName}</Text>
                    <Text style={styles.selectedUserUsername}>@{selectedUser.username}</Text>
                  </View>
                </View>
                
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type your message..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newMessageContent}
                  onChangeText={setNewMessageContent}
                  multiline
                  numberOfLines={3}
                />
                
                <View style={styles.messageActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setSelectedUser(null);
                      setNewMessageContent('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.sendButton, !newMessageContent.trim() && styles.sendButtonDisabled]}
                    onPress={handleNewMessage}
                    disabled={!newMessageContent.trim()}
                  >
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </AppPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  newMessageContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  newMessageText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    textAlign: 'center',
    lineHeight: 48,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  unreadMessage: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startConversationButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startConversationText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  messageInputContainer: {
    gap: 16,
  },
  selectedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  selectedUserUsername: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  messageInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  sendButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
});

export default MessagesScreen; 