// src/screens/main/GroupsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { AppPage } from '@/components/app-page'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { getUserGroups, Group } from '@/services/groupService';
import { useSolana } from '@/contexts/SolanaProvider';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type GroupsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock data for groups
const MOCK_GROUPS: Group[] = [
  {
    address: { toBase58: () => 'group1' } as any,
    name: 'Solana Developers',
    description: 'A community for Solana developers to share knowledge and collaborate',
    creator: { toBase58: () => 'creator1' } as any,
    isChannel: false,
    isWhaleGroup: false,
    requiredAmount: 0,
    requiredSolBalance: 0,
    memberCount: 128,
    createdAt: Date.now() - 1000000,
    lastMessageAt: Date.now() - 10000,
  },
  {
    address: { toBase58: () => 'group2' } as any,
    name: 'NFT Collectors',
    description: 'Discuss and trade NFTs on Solana',
    creator: { toBase58: () => 'creator2' } as any,
    isChannel: false,
    isWhaleGroup: false,
    requiredNftCollection: { toBase58: () => 'collection1' } as any,
    requiredAmount: 1,
    requiredSolBalance: 0,
    memberCount: 75,
    createdAt: Date.now() - 2000000,
    lastMessageAt: Date.now() - 50000,
  },
  {
    address: { toBase58: () => 'group3' } as any,
    name: 'Solana Whales',
    description: 'Exclusive group for Solana whales',
    creator: { toBase58: () => 'creator3' } as any,
    isChannel: false,
    isWhaleGroup: true,
    requiredAmount: 0,
    requiredSolBalance: 1000,
    memberCount: 12,
    createdAt: Date.now() - 3000000,
    lastMessageAt: Date.now() - 100000,
  },
  {
    address: { toBase58: () => 'group4' } as any,
    name: 'Meme Lords',
    description: 'The best memes on Solana',
    creator: { toBase58: () => 'creator4' } as any,
    isChannel: false,
    isWhaleGroup: false,
    requiredAmount: 0,
    requiredSolBalance: 0,
    memberCount: 256,
    createdAt: Date.now() - 4000000,
    lastMessageAt: Date.now() - 5000,
  },
  {
    address: { toBase58: () => 'group5' } as any,
    name: 'Solana News',
    description: 'Official channel for Solana ecosystem news',
    creator: { toBase58: () => 'creator5' } as any,
    isChannel: true,
    isWhaleGroup: false,
    requiredAmount: 0,
    requiredSolBalance: 0,
    memberCount: 1024,
    createdAt: Date.now() - 5000000,
    lastMessageAt: Date.now() - 20000,
  },
];

const GroupsScreen = () => {
  console.log('GroupsScreen rendered');
  const navigation = useNavigation<GroupsScreenNavigationProp>();
  const { publicKey, connection } = useSolana();
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined');

  // Load groups
  const loadGroups = async () => {
    setRefreshing(true);
    try {
      if (publicKey && connection) {
        // Fetch groups from the blockchain
        const userGroups = await getUserGroups(connection, publicKey);
        setGroups(userGroups);
        setFilteredGroups(userGroups);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, [publicKey]);

  // Filter groups when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, groups]);

  // Handle refresh
  const handleRefresh = () => {
    loadGroups();
  };

  // Render group item
  const renderGroupItem = ({ item, index }: { item: Group; index: number }) => (
    <TouchableOpacity 
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.name} group`}
      style={styles.groupItem}
      activeOpacity={0.8}
      onPress={() => (navigation as any).navigate('GroupChat', {
        groupAddress: item.address.toBase58(),
        groupName: item.name,
        groupDescription: item.description,
        memberCount: item.memberCount,
        isChannel: item.isChannel,
        creator: item.creator?.toBase58 ? item.creator.toBase58() : String(item.creator),
      })}
    >
      <View style={styles.groupIconContainer}>
        {item.isChannel ? (
          <Icon name="bullhorn" size={24} color={theme.colors.accent} />
        ) : item.isWhaleGroup ? (
          <Icon name="currency-usd" size={24} color={theme.colors.warning} />
        ) : item.requiredNftCollection ? (
          <Icon name="image" size={24} color={theme.colors.success} />
        ) : (
          <Icon name="account-group" size={24} color={theme.colors.accent} />
        )}
      </View>
      
      <View style={styles.groupContent}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.memberCount}>{item.memberCount} members</Text>
        </View>
        
        <Text style={styles.groupDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.groupFooter}>
          {item.isChannel && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Channel</Text>
            </View>
          )}
          
          {item.isWhaleGroup && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Whale</Text>
            </View>
          )}
          
          {item.requiredNftCollection && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>NFT Gated</Text>
            </View>
          )}
          
          {item.requiredToken && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Token Gated</Text>
            </View>
          )}
          
          <Text style={styles.lastActive}>
            Last active: {formatLastActive(item.lastMessageAt)}
          </Text>
        </View>
      </View>
      
      <Icon name="chevron-right" size={24} color={theme.colors.muted} />
    </TouchableOpacity>
  );

  // Format last active time
  const formatLastActive = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return `${Math.floor(diff / 86400000)}d ago`;
    }
  };

  return (
    <AppPage>
      <FlatList
        data={filteredGroups}
        renderItem={({ item, index }) => renderGroupItem({ item, index })}
        keyExtractor={item => item.address.toBase58()}
        contentContainerStyle={styles.groupList}
        initialNumToRender={10}
        windowSize={11}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.accent]}
            tintColor={theme.colors.accent}
          />
        }
        ListHeaderComponent={
          <>
            {/* Search bar */}
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={theme.colors.muted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search groups..."
                placeholderTextColor={theme.colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close" size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
                onPress={() => setActiveTab('joined')}
              >
                <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTabText]}>
                  My Groups
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
                onPress={() => setActiveTab('discover')}
              >
                <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
                  Discover
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-group-outline" size={48} color={theme.colors.text} />
            <Text style={styles.emptyText}>
              {searchQuery.length > 0
                ? 'No groups match your search'
                : activeTab === 'joined'
                ? 'You haven\'t joined any groups yet'
                : 'No groups to discover'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('CreateGroup')}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('JoinGroup')}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Join Group (with Invite)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('Invite', { groupAddress: '1' })}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>View Group Invites</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Create group button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Icon name="plus" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </AppPage>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: theme.colors.text,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.roundness - 4,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.muted,
  },
  activeTabText: {
    color: theme.colors.text,
  },
  groupList: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for floating button
  },
  groupItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupContent: {
    flex: 1,
    marginRight: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  memberCount: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  groupDescription: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 8,
  },
  groupFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagContainer: {
    backgroundColor: theme.colors.primary + '40', // 25% opacity
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.accent,
  },
  lastActive: {
    fontSize: 12,
    color: theme.colors.muted,
    marginLeft: 'auto',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  createGroupButton: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.roundness,
  },
  createGroupText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  button: {
    marginVertical: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GroupsScreen;