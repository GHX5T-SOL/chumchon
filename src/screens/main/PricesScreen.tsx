// src/screens/main/PricesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import { AppPage } from '@/components/app-page'
// Removed Moti animations to simplify startup
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type PricesScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Token interface
interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  createdAt: string;
  isTrending: boolean;
  icon: string;
  color: string;
}

// Mock tokens data
const MOCK_TOKENS: Token[] = [
  {
    id: '1',
    name: 'Solana',
    symbol: 'SOL',
    address: 'So11111111111111111111111111111111111111112',
    price: 186.42,
    priceChange24h: 5.23,
    marketCap: 85000000000,
    volume24h: 2500000000,
    createdAt: '3 years ago',
    isTrending: true,
    icon: 'currency-btc',
    color: '#9945FF',
  },
  {
    id: '2',
    name: 'Fartcoin',
    symbol: 'FART',
    address: 'FART111111111111111111111111111111111111111111',
    price: 1.23,
    priceChange24h: 45.67,
    marketCap: 123000000,
    volume24h: 45000000,
    createdAt: '2 days ago',
    isTrending: true,
    icon: 'currency-usd',
    color: '#FF6B6B',
  },
  {
    id: '3',
    name: 'Aura Token',
    symbol: 'AURA',
    address: 'AURA111111111111111111111111111111111111111111',
    price: 0.17,
    priceChange24h: -12.34,
    marketCap: 85000000,
    volume24h: 12000000,
    createdAt: '1 week ago',
    isTrending: false,
    icon: 'star',
    color: '#4ECDC4',
  },
  {
    id: '4',
    name: 'Bonk',
    symbol: 'BONK',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    price: 0.000023,
    priceChange24h: 8.91,
    marketCap: 23000000,
    volume24h: 8900000,
    createdAt: '6 months ago',
    isTrending: true,
    icon: 'dog',
    color: '#FFA500',
  },
  {
    id: '5',
    name: 'Jupiter',
    symbol: 'JUP',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    price: 0.89,
    priceChange24h: 15.67,
    marketCap: 890000000,
    volume24h: 67000000,
    createdAt: '1 year ago',
    isTrending: false,
    icon: 'rocket',
    color: '#FF6B35',
  },
  {
    id: '6',
    name: 'Raydium',
    symbol: 'RAY',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    price: 2.34,
    priceChange24h: -3.45,
    marketCap: 234000000,
    volume24h: 34000000,
    createdAt: '2 years ago',
    isTrending: false,
    icon: 'flash',
    color: '#00D4AA',
  },
  {
    id: '7',
    name: 'Serum',
    symbol: 'SRM',
    address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    price: 0.056,
    priceChange24h: 2.34,
    marketCap: 56000000,
    volume24h: 8900000,
    createdAt: '3 years ago',
    isTrending: false,
    icon: 'chart-line',
    color: '#3CB371',
  },
  {
    id: '8',
    name: 'Mango',
    symbol: 'MNGO',
    address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
    price: 0.023,
    priceChange24h: -7.89,
    marketCap: 23000000,
    volume24h: 4500000,
    createdAt: '1.5 years ago',
    isTrending: false,
    icon: 'fruit-cherries',
    color: '#FFD700',
  },
  {
    id: '9',
    name: 'Orca',
    symbol: 'ORCA',
    address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
    price: 3.45,
    priceChange24h: 12.67,
    marketCap: 345000000,
    volume24h: 56000000,
    createdAt: '2.5 years ago',
    isTrending: true,
    icon: 'fish',
    color: '#00BFFF',
  },
  {
    id: '10',
    name: 'Saber',
    symbol: 'SBR',
    address: 'Saber2gLaoYgm4nC8K6uqrWzrRk7V5syaHgLgXkgXVP',
    price: 0.078,
    priceChange24h: -4.56,
    marketCap: 78000000,
    volume24h: 12000000,
    createdAt: '1.8 years ago',
    isTrending: false,
    icon: 'sword-cross',
    color: '#8A2BE2',
  },
];

type SortOption = 'marketCap' | 'price' | 'volume24h' | 'priceChange24h' | 'age';
type TabType = 'all' | 'trending';

const PricesScreen = () => {
  const navigation = useNavigation<PricesScreenNavigationProp>();
  const { publicKey } = useSolana();
  
  // State
  const [tokens, setTokens] = useState<Token[]>(MOCK_TOKENS);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(MOCK_TOKENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Filter and sort tokens
  useEffect(() => {
    let filtered = tokens;
    
    // Filter by tab
    if (selectedTab === 'trending') {
      filtered = filtered.filter(token => token.isTrending);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort tokens
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortBy) {
        case 'marketCap':
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'volume24h':
          aValue = a.volume24h;
          bValue = b.volume24h;
          break;
        case 'priceChange24h':
          aValue = a.priceChange24h;
          bValue = b.priceChange24h;
          break;
        case 'age':
          // Convert age to days for sorting
          aValue = getAgeInDays(a.createdAt);
          bValue = getAgeInDays(b.createdAt);
          break;
        default:
          aValue = a.marketCap;
          bValue = b.marketCap;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    setFilteredTokens(filtered);
  }, [tokens, selectedTab, searchQuery, sortBy, sortOrder]);

  // Get age in days for sorting
  const getAgeInDays = (ageString: string): number => {
    if (ageString.includes('years')) {
      return parseInt(ageString) * 365;
    } else if (ageString.includes('months')) {
      return parseInt(ageString) * 30;
    } else if (ageString.includes('weeks')) {
      return parseInt(ageString) * 7;
    } else if (ageString.includes('days')) {
      return parseInt(ageString);
    } else if (ageString.includes('hours')) {
      return parseInt(ageString) / 24;
    } else {
      return 0;
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Update prices with random changes
      setTokens(prev => prev.map(token => ({
        ...token,
        price: token.price * (1 + (Math.random() - 0.5) * 0.1),
        priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 10,
      })));
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Format market cap
  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  // Format volume
  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };

  // Render token item
  const renderTokenItem = ({ item, index }: { item: Token; index: number }) => (
    <TouchableOpacity
      style={styles.tokenItem}
      accessibilityRole="button"
      accessibilityLabel={`Open token ${item.name}`}
      activeOpacity={0.8}
    >
      <View style={styles.tokenInfo}>
        <View style={[styles.tokenIcon, { backgroundColor: item.color }]}>
          <Icon name={item.icon as any} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.tokenDetails}>
          <Text style={styles.tokenName}>{item.name}</Text>
          <Text style={styles.tokenSymbol}>{item.symbol}</Text>
          <Text style={styles.tokenAge}>{item.createdAt}</Text>
        </View>
      </View>
      
      <View style={styles.tokenPrice}>
        <Text style={styles.priceText}>${item.price.toFixed(6)}</Text>
        <Text style={[
          styles.priceChange,
          { color: item.priceChange24h >= 0 ? theme.colors.success : theme.colors.error }
        ]}>
          {item.priceChange24h >= 0 ? '+' : ''}{item.priceChange24h.toFixed(2)}%
        </Text>
      </View>
      
      <View style={styles.tokenStats}>
        <Text style={styles.marketCapText}>{formatMarketCap(item.marketCap)}</Text>
        <Text style={styles.volumeText}>{formatVolume(item.volume24h)}</Text>
      </View>
      
      {item.isTrending && (
        <View style={styles.trendingBadge}>
          <Icon name="trending-up" size={12} color={theme.colors.accent} />
          <Text style={styles.trendingText}>Trending</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render sort option
  const renderSortOption = (option: SortOption, label: string) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        sortBy === option && styles.sortOptionActive
      ]}
      onPress={() => {
        if (sortBy === option) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(option);
          setSortOrder('desc');
        }
        setShowSortModal(false);
      }}
    >
      <Text style={[
        styles.sortOptionText,
        sortBy === option && styles.sortOptionTextActive
      ]}>
        {label}
      </Text>
      {sortBy === option && (
        <Icon 
          name={sortOrder === 'desc' ? 'sort-descending' : 'sort-ascending'} 
          size={16} 
          color={theme.colors.accent} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <AppPage>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Prices</Text>
        <Text style={styles.subtitle}>Real-time token prices and market data</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, symbol, or address..."
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

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'all' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All Tokens
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'trending' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('trending')}
        >
          <Icon name="trending-up" size={16} color={selectedTab === 'trending' ? theme.colors.accent : theme.colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === 'trending' && styles.tabTextActive]}>
            Trending Today
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort Button */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Icon name="sort" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.sortButtonText}>
            Sort by: {sortBy === 'marketCap' ? 'Market Cap' : 
                      sortBy === 'price' ? 'Price' :
                      sortBy === 'volume24h' ? 'Volume' :
                      sortBy === 'priceChange24h' ? '24h Change' : 'Age'}
          </Text>
          <Icon name="chevron-down" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Token List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading prices...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTokens}
          renderItem={({ item, index }) => renderTokenItem({ item, index })}
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
      )}

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {renderSortOption('marketCap', 'Market Cap')}
            {renderSortOption('price', 'Price')}
            {renderSortOption('volume24h', '24h Volume')}
            {renderSortOption('priceChange24h', '24h Change')}
            {renderSortOption('age', 'Age')}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.accent + '20',
    borderColor: theme.colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.accent,
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tokenItem: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenDetails: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  tokenSymbol: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  tokenAge: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  tokenPrice: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  tokenStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marketCapText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  volumeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.accent,
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
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sortOptionActive: {
    backgroundColor: theme.colors.accent + '10',
  },
  sortOptionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  sortOptionTextActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default PricesScreen; 