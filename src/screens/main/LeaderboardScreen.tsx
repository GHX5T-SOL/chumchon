// src/screens/main/LeaderboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, Alert, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { AppPage } from '@/components/app-page'
import { MotiPressable } from 'moti/interactions'
import { MotiView } from 'moti'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { shortenAddress } from '@/services/programService';
import { getTopTraders, trackTrader, copyTrader, Trader } from '@/services/leaderboardService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LeaderboardScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock trader data for fallback
const MOCK_TRADERS: Trader[] = [
  {
    id: '1',
    username: 'CryptoWhale_420',
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto1',
    dailyPnl: 15420.50,
    weeklyPnl: 89230.75,
    monthlyPnl: 324500.25,
    totalPnl: 1250000.00,
    winRate: 87.5,
    tradesCount: 156,
    followers: 2847,
    isTracked: false,
    isCopied: false,
    rank: 1,
    tags: ['DeFi', 'Yield Farming', 'Leverage'],
  },
  {
    id: '2',
    username: 'SolanaSniper',
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto2',
    dailyPnl: 12350.25,
    weeklyPnl: 65420.50,
    monthlyPnl: 289400.75,
    totalPnl: 980000.00,
    winRate: 82.3,
    tradesCount: 203,
    followers: 2156,
    isTracked: true,
    isCopied: false,
    rank: 2,
    tags: ['NFTs', 'Meme Coins', 'Arbitrage'],
  },
  {
    id: '3',
    username: 'DeFi_Degenerate',
    address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto3',
    dailyPnl: 9875.75,
    weeklyPnl: 45680.25,
    monthlyPnl: 198750.50,
    totalPnl: 750000.00,
    winRate: 79.8,
    tradesCount: 178,
    followers: 1892,
    isTracked: false,
    isCopied: true,
    rank: 3,
    tags: ['Options', 'Futures', 'High Risk'],
  },
  {
    id: '4',
    username: 'NFT_Hunter',
    address: '3xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto4',
    dailyPnl: 8765.50,
    weeklyPnl: 38950.75,
    monthlyPnl: 165420.25,
    totalPnl: 620000.00,
    winRate: 85.2,
    tradesCount: 134,
    followers: 1654,
    isTracked: false,
    isCopied: false,
    rank: 4,
    tags: ['NFTs', 'Art', 'Collectibles'],
  },
  {
    id: '5',
    username: 'Yield_Farmer_Pro',
    address: '2xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto5',
    dailyPnl: 7654.25,
    weeklyPnl: 32450.50,
    monthlyPnl: 142800.75,
    totalPnl: 520000.00,
    winRate: 91.7,
    tradesCount: 89,
    followers: 1423,
    isTracked: true,
    isCopied: false,
    rank: 5,
    tags: ['Yield Farming', 'Staking', 'Conservative'],
  },
  {
    id: '6',
    username: 'Meme_Coin_King',
    address: '1xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto6',
    dailyPnl: 6543.75,
    weeklyPnl: 28950.25,
    monthlyPnl: 125400.50,
    totalPnl: 480000.00,
    winRate: 76.4,
    tradesCount: 267,
    followers: 1987,
    isTracked: false,
    isCopied: false,
    rank: 6,
    tags: ['Meme Coins', 'Pump & Dump', 'High Volume'],
  },
  {
    id: '7',
    username: 'Arbitrage_Master',
    address: '8xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto7',
    dailyPnl: 5432.50,
    weeklyPnl: 25480.75,
    monthlyPnl: 112300.25,
    totalPnl: 420000.00,
    winRate: 88.9,
    tradesCount: 445,
    followers: 2234,
    isTracked: false,
    isCopied: true,
    rank: 7,
    tags: ['Arbitrage', 'DEX', 'Low Risk'],
  },
  {
    id: '8',
    username: 'Leverage_Lord',
    address: '9xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto8',
    dailyPnl: 4321.25,
    weeklyPnl: 22450.50,
    monthlyPnl: 98750.75,
    totalPnl: 380000.00,
    winRate: 73.2,
    tradesCount: 189,
    followers: 1654,
    isTracked: false,
    isCopied: false,
    rank: 8,
    tags: ['Leverage', 'Futures', 'High Risk'],
  },
];

type TimeFrame = 'daily' | 'weekly' | 'monthly';

const LeaderboardScreen = () => {
  const navigation = useNavigation<LeaderboardScreenNavigationProp>();
  const { publicKey, connection, signAndSendTransaction } = useSolana();
  
  const [traders, setTraders] = useState<Trader[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('daily');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [copyAmount, setCopyAmount] = useState('');

  // Load traders on mount and when time frame changes
  useEffect(() => {
    loadTraders();
  }, [selectedTimeFrame, connection]);

  // Sort traders based on selected time frame
  const sortedTraders = [...traders].sort((a, b) => {
    const aPnl = selectedTimeFrame === 'daily' ? a.dailyPnl : 
                  selectedTimeFrame === 'weekly' ? a.weeklyPnl : a.monthlyPnl;
    const bPnl = selectedTimeFrame === 'daily' ? b.dailyPnl : 
                  selectedTimeFrame === 'weekly' ? b.weeklyPnl : b.monthlyPnl;
    return bPnl - aPnl;
  });

  const loadTraders = async () => {
    if (!connection) return;
    
    try {
      setLoading(true);
      const fetchedTraders = await getTopTraders(connection, selectedTimeFrame, 50);
      setTraders(fetchedTraders);
    } catch (error) {
      console.error('Failed to load traders:', error);
      // Fallback to mock data
      setTraders(MOCK_TRADERS);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTraders();
    } catch (error) {
      console.error('Failed to refresh leaderboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTrackTrader = async (traderId: string) => {
    if (!publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }
    
    const trader = traders.find(t => t.id === traderId);
    if (!trader) return;
    
    try {
      await trackTrader(connection, signAndSendTransaction, publicKey, trader.address);
      
      // Update local state
      setTraders(prev => prev.map(t => 
        t.id === traderId 
          ? { ...t, isTracked: !t.isTracked }
          : t
      ));
      
      Alert.alert(
        trader.isTracked ? 'Untracked' : 'Tracked',
        `${trader.username} has been ${trader.isTracked ? 'untracked' : 'tracked'}. You will ${trader.isTracked ? 'no longer' : 'now'} receive notifications about their trades.`
      );
    } catch (error) {
      console.error('Failed to track trader:', error);
      Alert.alert('Error', 'Failed to track trader. Please try again.');
    }
  };

  const handleCopyTrader = (trader: Trader) => {
    setSelectedTrader(trader);
    setShowCopyModal(true);
  };

  const handleCopyTraderConfirm = async () => {
    if (!selectedTrader || !copyAmount || !publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Please connect your wallet and enter an amount');
      return;
    }
    
    const amount = parseFloat(copyAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    try {
      await copyTrader(connection, signAndSendTransaction, publicKey, selectedTrader.address, amount);
      
      // Update local state
      setTraders(prev => prev.map(trader => 
        trader.id === selectedTrader.id 
          ? { ...trader, isCopied: true }
          : trader
      ));
      
      Alert.alert(
        'Copy Trader',
        `You are now copying ${selectedTrader.username} with $${copyAmount} USD. You will receive notifications when they make trades.`
      );
      
      setShowCopyModal(false);
      setSelectedTrader(null);
      setCopyAmount('');
    } catch (error) {
      console.error('Failed to copy trader:', error);
      Alert.alert('Error', 'Failed to copy trader. Please try again.');
    }
  };

  const formatPnl = (pnl: number) => {
    const isPositive = pnl >= 0;
    const formatted = Math.abs(pnl).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${isPositive ? '+' : '-'}$${formatted}`;
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? theme.colors.success : theme.colors.error;
  };

  const renderTraderItem = ({ item, index }: { item: Trader; index: number }) => {
    const pnl = selectedTimeFrame === 'daily' ? item.dailyPnl : 
                selectedTimeFrame === 'weekly' ? item.weeklyPnl : item.monthlyPnl;
    
    return (
      <MotiPressable
        from={{ opacity: 0, translateY: 6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 40, type: 'timing', duration: 220 }}
        pressStyle={{ scale: 0.98 }}
        style={styles.traderCard}
        accessibilityRole="button"
        accessibilityLabel={`Open trader ${item.username}`}
        onPress={() => {}}
      >
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>#{item.rank}</Text>
          {index < 3 && (
            <Icon 
              name="trophy" 
              size={20} 
              color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
            />
          )}
        </View>
        
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.traderInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.address}>{shortenAddress(item.address)}</Text>
          
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag, tagIndex) => (
              <View key={tagIndex} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Win Rate: {item.winRate}%</Text>
            <Text style={styles.statText}>Trades: {item.tradesCount}</Text>
          </View>
        </View>
        
        <View style={styles.pnlContainer}>
          <Text style={[styles.pnlText, { color: getPnlColor(pnl) }]}>
            {formatPnl(pnl)}
          </Text>
          <Text style={styles.timeFrameText}>
            {selectedTimeFrame.charAt(0).toUpperCase() + selectedTimeFrame.slice(1)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, item.isTracked && styles.actionButtonActive]}
            onPress={() => handleTrackTrader(item.id)}
          >
            <Icon 
              name={item.isTracked ? "bell" : "bell-outline"} 
              size={16} 
              color={item.isTracked ? theme.colors.accent : theme.colors.textSecondary} 
            />
            <Text style={[styles.actionButtonText, item.isTracked && styles.actionButtonTextActive]}>
              {item.isTracked ? 'Tracked' : 'Track'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, item.isCopied && styles.actionButtonActive]}
            onPress={() => handleCopyTrader(item)}
          >
            <Icon 
              name={item.isCopied ? "content-copy" : "content-copy"} 
              size={16} 
              color={item.isCopied ? theme.colors.accent : theme.colors.textSecondary} 
            />
            <Text style={[styles.actionButtonText, item.isCopied && styles.actionButtonTextActive]}>
              {item.isCopied ? 'Copied' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>
      </MotiPressable>
    );
  };

  const renderTimeFrameSelector = () => (
    <View style={styles.timeFrameContainer}>
      {(['daily', 'weekly', 'monthly'] as TimeFrame[]).map((timeFrame) => (
        <TouchableOpacity
          key={timeFrame}
          style={[
            styles.timeFrameButton,
            selectedTimeFrame === timeFrame && styles.timeFrameButtonActive
          ]}
          onPress={() => setSelectedTimeFrame(timeFrame)}
        >
          <Text style={[
            styles.timeFrameButtonText,
            selectedTimeFrame === timeFrame && styles.timeFrameButtonTextActive
          ]}>
            {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <AppPage>
      <View style={styles.header}>
        <Text style={styles.title}>Top Traders</Text>
        <Text style={styles.subtitle}>Live P&L Leaderboard</Text>
      </View>
      
      {renderTimeFrameSelector()}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading top traders...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTraders}
          renderItem={renderTraderItem}
          keyExtractor={(item) => item.id}
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      {/* Copy Trader Modal */}
      <Modal
        visible={showCopyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCopyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Copy Trader</Text>
            <Text style={styles.modalSubtitle}>
              Copy {selectedTrader?.username}'s trading strategy
            </Text>
            
            <View style={styles.modalTraderInfo}>
              <Image source={{ uri: selectedTrader?.avatar }} style={styles.modalAvatar} />
              <View>
                <Text style={styles.modalUsername}>{selectedTrader?.username}</Text>
                <Text style={styles.modalStats}>
                  Win Rate: {selectedTrader?.winRate}% | Trades: {selectedTrader?.tradesCount}
                </Text>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount to Copy (USD)</Text>
              <TextInput
                style={styles.input}
                value={copyAmount}
                onChangeText={setCopyAmount}
                placeholder="Enter amount"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowCopyModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleCopyTraderConfirm}
              >
                <Text style={styles.modalButtonTextPrimary}>Copy Trader</Text>
              </TouchableOpacity>
            </View>
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
  timeFrameContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeFrameButtonActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  timeFrameButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  timeFrameButtonTextActive: {
    color: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  traderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 30,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  traderInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: theme.colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  pnlContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  pnlText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timeFrameText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.border,
    gap: 4,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.accent + '20',
  },
  actionButtonText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  actionButtonTextActive: {
    color: theme.colors.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  modalTraderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  modalStats: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
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
});

export default LeaderboardScreen; 