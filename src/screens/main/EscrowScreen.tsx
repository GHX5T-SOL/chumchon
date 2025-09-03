// src/screens/main/EscrowScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { AppPage } from '@/components/app-page'
import { MotiView } from 'moti'
import { MotiPressable } from 'moti'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { getUserEscrows, Escrow, EscrowStatus } from '@/services/escrowService';
import { shortenAddress } from '@/services/programService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type EscrowScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock data for escrows
const MOCK_ESCROWS: Escrow[] = [
  {
    address: { toBase58: () => 'escrow1' } as any,
    initiator: { toBase58: () => 'user1' } as any,
    counterparty: { toBase58: () => 'user2' } as any,
    group: { toBase58: () => 'group1' } as any,
    initiatorToken: { toBase58: () => 'token1' } as any,
    initiatorAmount: 100,
    counterpartyToken: { toBase58: () => 'token2' } as any,
    counterpartyAmount: 50,
    status: EscrowStatus.Pending,
    createdAt: Date.now() - 3600000,
    expiresAt: Date.now() + 86400000,
  },
  {
    address: { toBase58: () => 'escrow2' } as any,
    initiator: { toBase58: () => 'user2' } as any,
    counterparty: { toBase58: () => 'user1' } as any,
    group: { toBase58: () => 'group2' } as any,
    initiatorToken: { toBase58: () => 'token3' } as any,
    initiatorAmount: 5,
    counterpartyToken: { toBase58: () => 'token4' } as any,
    counterpartyAmount: 10,
    status: EscrowStatus.Accepted,
    createdAt: Date.now() - 7200000,
    expiresAt: Date.now() + 43200000,
  },
  {
    address: { toBase58: () => 'escrow3' } as any,
    initiator: { toBase58: () => 'user1' } as any,
    counterparty: { toBase58: () => 'user3' } as any,
    group: { toBase58: () => 'group3' } as any,
    initiatorToken: { toBase58: () => 'token5' } as any,
    initiatorAmount: 1,
    counterpartyToken: { toBase58: () => 'token6' } as any,
    counterpartyAmount: 1000,
    status: EscrowStatus.Completed,
    createdAt: Date.now() - 172800000,
    expiresAt: Date.now() - 86400000,
  },
  {
    address: { toBase58: () => 'escrow4' } as any,
    initiator: { toBase58: () => 'user3' } as any,
    counterparty: { toBase58: () => 'user1' } as any,
    group: { toBase58: () => 'group1' } as any,
    initiatorToken: { toBase58: () => 'token7' } as any,
    initiatorAmount: 2.5,
    counterpartyToken: { toBase58: () => 'token8' } as any,
    counterpartyAmount: 500,
    status: EscrowStatus.Cancelled,
    createdAt: Date.now() - 259200000,
    expiresAt: Date.now() - 172800000,
  },
];

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

const EscrowScreen = () => {
  console.log('EscrowScreen rendered');
  const navigation = useNavigation<EscrowScreenNavigationProp>();
  const { publicKey, connection } = useSolana();
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Load escrows
  const loadEscrows = async () => {
    setRefreshing(true);
    try {
      if (publicKey && connection) {
        // Fetch escrows from the blockchain
        const userEscrows = await getUserEscrows(connection, publicKey);
        setEscrows(userEscrows);
      }
    } catch (error) {
      console.error('Failed to load escrows:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load escrows on mount
  useEffect(() => {
    loadEscrows();
  }, [publicKey]);

  // Filter escrows based on active tab
  const filteredEscrows = escrows.filter(escrow => {
    if (activeTab === 'active') {
      return escrow.status === EscrowStatus.Pending || escrow.status === EscrowStatus.Accepted;
    } else {
      return escrow.status === EscrowStatus.Completed || escrow.status === EscrowStatus.Cancelled;
    }
  });

  // Handle refresh
  const handleRefresh = () => {
    loadEscrows();
  };

  // Get token name
  const getTokenName = (tokenAddress: string): string => {
    return TOKEN_NAMES[tokenAddress] || 'Unknown';
  };

  // Get status color
  const getStatusColor = (status: EscrowStatus): string => {
    switch (status) {
      case EscrowStatus.Pending:
        return theme.colors.warning;
      case EscrowStatus.Accepted:
        return theme.colors.info;
      case EscrowStatus.Completed:
        return theme.colors.success;
      case EscrowStatus.Cancelled:
        return theme.colors.error;
      default:
        return theme.colors.muted;
    }
  };

  // Get status text
  const getStatusText = (status: EscrowStatus): string => {
    switch (status) {
      case EscrowStatus.Pending:
        return 'Pending';
      case EscrowStatus.Accepted:
        return 'Accepted';
      case EscrowStatus.Completed:
        return 'Completed';
      case EscrowStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
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
      return `${days}d ${hours % 24}h remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  // Render escrow item
  const renderEscrowItem = ({ item, index }: { item: Escrow; index: number }) => {
    const isInitiator = publicKey?.toBase58() === item.initiator.toBase58();
    const otherParty = isInitiator ? item.counterparty : item.initiator;
    
    return (
      <MotiPressable 
        from={{ opacity: 0, translateY: 6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 50, type: 'timing', duration: 250 }}
        pressStyle={{ scale: 0.98 }}
        style={styles.escrowItem}
        onPress={() => navigation.navigate('EscrowDetail', { escrowAddress: item.address.toBase58() })}
        accessibilityRole="button"
        accessibilityLabel={`Open escrow ${item.address.toBase58()}`}
      >
        <View style={styles.escrowHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={styles.escrowTitle}>
            {isInitiator ? 'You' : shortenAddress(item.initiator.toBase58())} ↔️ {isInitiator ? shortenAddress(item.counterparty.toBase58()) : 'You'}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        
        <View style={styles.exchangeContainer}>
          <View style={styles.exchangeSide}>
            <Text style={styles.amountText}>
              {item.initiatorAmount} {getTokenName(item.initiatorToken.toBase58())}
            </Text>
            <Text style={styles.partyText}>
              {isInitiator ? 'You offer' : `They offer`}
            </Text>
          </View>
          
          <View style={styles.exchangeArrow}>
            <Icon name="swap-horizontal" size={24} color={theme.colors.accent} />
          </View>
          
          <View style={styles.exchangeSide}>
            <Text style={styles.amountText}>
              {item.counterpartyAmount} {getTokenName(item.counterpartyToken.toBase58())}
            </Text>
            <Text style={styles.partyText}>
              {isInitiator ? 'You receive' : 'You offer'}
            </Text>
          </View>
        </View>
        
        <View style={styles.escrowFooter}>
          <Text style={styles.groupText}>
            In {shortenAddress(item.group.toBase58())}
          </Text>
          
          {item.status === EscrowStatus.Pending && (
            <Text style={styles.timeText}>
              {formatTimeRemaining(item.expiresAt)}
            </Text>
          )}
          
          {item.status === EscrowStatus.Accepted && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => navigation.navigate('EscrowDetail', { escrowAddress: item.address.toBase58() })}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </MotiPressable>
    );
  };

  return (
    <AppPage>
      <FlatList
        data={filteredEscrows}
        renderItem={({ item, index }) => renderEscrowItem({ item, index })}
        keyExtractor={item => item.address.toBase58()}
        contentContainerStyle={styles.escrowList}
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
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Escrow Deals</Text>
              <Text style={styles.headerSubtitle}>
                Securely trade tokens with other users
              </Text>
            </View>
            
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                onPress={() => setActiveTab('active')}
              >
                <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                  Active
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                onPress={() => setActiveTab('completed')}
              >
                <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                  History
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="swap-horizontal" size={48} color={theme.colors.text} />
            <Text style={styles.emptyText}>
              {activeTab === 'active'
                ? 'No active escrow deals'
                : 'No completed escrow deals'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('CreateEscrow')}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Create Escrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('EscrowDetail', { escrowAddress: '1' })}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>View Escrow Details</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Create escrow button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateEscrow')}
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
  header: {
    backgroundColor: theme.colors.primary,
    padding: 24,
    marginHorizontal: -16, // Extend beyond the parent's horizontal padding
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.text + 'CC', // 80% opacity
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
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
  escrowList: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for floating button
  },
  escrowItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  escrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  escrowTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  exchangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exchangeSide: {
    flex: 1,
    alignItems: 'center',
  },
  exchangeArrow: {
    paddingHorizontal: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  partyText: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  escrowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  groupText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.warning,
  },
  completeButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.roundness,
  },
  completeButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
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
  createEscrowButton: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.roundness,
  },
  createEscrowText: {
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

export default EscrowScreen;