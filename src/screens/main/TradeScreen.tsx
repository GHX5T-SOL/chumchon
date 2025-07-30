// src/screens/main/TradeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { useAuth } from '@/contexts/AuthProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TradeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Token interface
interface Token {
  symbol: string;
  name: string;
  address: string;
  icon: string;
  price: number;
  balance?: number;
}

// Mock tokens data
const MOCK_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    address: 'So11111111111111111111111111111111111111112',
    icon: 'currency-btc',
    price: 186.00,
    balance: 14.0,
  },
  {
    symbol: 'FART',
    name: 'Fartcoin',
    address: 'FART111111111111111111111111111111111111111111',
    icon: 'currency-usd',
    price: 1.23,
    balance: 5320.0,
  },
  {
    symbol: 'AURA',
    name: 'Aura Token',
    address: 'AURA111111111111111111111111111111111111111111',
    icon: 'star',
    price: 0.17,
    balance: 250000.0,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    icon: 'currency-usd',
    price: 1.00,
    balance: 0,
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    icon: 'dog',
    price: 0.000023,
    balance: 0,
  },
];

const TradeScreen = () => {
  const navigation = useNavigation<TradeScreenNavigationProp>();
  const { publicKey, connection, signAndSendTransaction } = useSolana();
  const { userProfile } = useAuth();
  
  // Trade state
  const [sellToken, setSellToken] = useState<Token>(MOCK_TOKENS[0]);
  const [buyToken, setBuyToken] = useState<Token>(MOCK_TOKENS[1]);
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectorType, setSelectorType] = useState<'sell' | 'buy'>('sell');
  
  // User holdings
  const [userHoldings, setUserHoldings] = useState<Token[]>([]);

  // Load user holdings
  useEffect(() => {
    const holdings = MOCK_TOKENS.filter(token => token.balance && token.balance > 0);
    setUserHoldings(holdings);
  }, []);

  // Calculate buy amount when sell amount changes
  useEffect(() => {
    if (sellAmount && sellToken && buyToken) {
      const sellValue = parseFloat(sellAmount) * sellToken.price;
      const buyValue = sellValue * 0.995; // 0.5% fee
      const buyAmountCalculated = buyValue / buyToken.price;
      setBuyAmount(buyAmountCalculated.toFixed(6));
    } else {
      setBuyAmount('');
    }
  }, [sellAmount, sellToken, buyToken]);

  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    if (selectorType === 'sell') {
      setSellToken(token);
      setSellAmount('');
    } else {
      setBuyToken(token);
      setBuyAmount('');
    }
    setShowTokenSelector(false);
  };

  // Handle swap tokens
  const handleSwapTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
  };

  // Handle trade execution
  const handleTrade = async () => {
    if (!publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount to sell');
      return;
    }

    if (sellToken.balance && parseFloat(sellAmount) > sellToken.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate trade execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Trade Successful!',
        `Successfully swapped ${sellAmount} ${sellToken.symbol} for ${buyAmount} ${buyToken.symbol}`,
        [{ text: 'OK' }]
      );
      
      // Update balances
      const sellValue = parseFloat(sellAmount);
      const buyValue = parseFloat(buyAmount);
      
      setUserHoldings(prev => prev.map(token => {
        if (token.symbol === sellToken.symbol) {
          return { ...token, balance: (token.balance || 0) - sellValue };
        }
        if (token.symbol === buyToken.symbol) {
          return { ...token, balance: (token.balance || 0) + buyValue };
        }
        return token;
      }));
      
      setSellAmount('');
      setBuyAmount('');
    } catch (error) {
      console.error('Trade failed:', error);
      Alert.alert('Error', 'Trade failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle buy/sell from holdings
  const handleHoldingsAction = (token: Token, action: 'buy' | 'sell') => {
    if (action === 'buy') {
      setBuyToken(token);
      setSellToken(MOCK_TOKENS[3]); // USDC
      setSellAmount('100'); // Default amount
    } else {
      setSellToken(token);
      setBuyToken(MOCK_TOKENS[3]); // USDC
      setSellAmount(token.balance?.toString() || '0');
    }
  };

  // Open token selector
  const openTokenSelector = (type: 'sell' | 'buy') => {
    setSelectorType(type);
    setShowTokenSelector(true);
  };

  // Render token item for selector
  const renderTokenItem = ({ item }: { item: Token }) => (
    <TouchableOpacity
      style={styles.tokenItem}
      onPress={() => handleTokenSelect(item)}
    >
      <View style={styles.tokenItemInfo}>
        <View style={[styles.tokenIcon, { backgroundColor: getTokenColor(item.symbol) }]}>
          <Icon name={item.icon as any} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.tokenItemDetails}>
          <Text style={styles.tokenItemSymbol}>{item.symbol}</Text>
          <Text style={styles.tokenItemName}>{item.name}</Text>
        </View>
      </View>
      <Text style={styles.tokenItemPrice}>${item.price.toFixed(6)}</Text>
    </TouchableOpacity>
  );

  // Get token color
  const getTokenColor = (symbol: string) => {
    switch (symbol) {
      case 'SOL': return '#9945FF';
      case 'FART': return '#FF6B6B';
      case 'AURA': return '#4ECDC4';
      case 'USDC': return '#2775CA';
      case 'BONK': return '#FFA500';
      default: return theme.colors.accent;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trade</Text>
        <Text style={styles.subtitle}>
          Swap any token on Solana DEXes with the best rates
        </Text>
      </View>

      {/* Trade Interface */}
      <View style={styles.tradeContainer}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity style={[styles.modeButton, styles.modeButtonActive]}>
            <Icon name="rocket" size={16} color={theme.colors.accent} />
            <Text style={[styles.modeText, styles.modeTextActive]}>Instant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton}>
            <Icon name="bell" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.modeText}>Trigger</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton}>
            <Icon name="refresh" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.modeText}>Recurring</Text>
          </TouchableOpacity>
        </View>

        {/* Route Info */}
        <View style={styles.routeInfo}>
          <View style={styles.routeBadge}>
            <Icon name="star" size={12} color={theme.colors.accent} />
            <Text style={styles.routeText}>Ultra V2</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Icon name="refresh" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sell Section */}
        <View style={styles.tokenSection}>
          <Text style={styles.sectionLabel}>Selling</Text>
          <View style={styles.tokenInput}>
            <TouchableOpacity
              style={styles.tokenSelector}
              onPress={() => openTokenSelector('sell')}
            >
              <View style={[styles.tokenIcon, { backgroundColor: getTokenColor(sellToken.symbol) }]}>
                <Icon name={sellToken.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.tokenSymbol}>{sellToken.symbol}</Text>
              <Icon name="chevron-down" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.amountInput}>
              <TextInput
                style={styles.amountText}
                value={sellAmount}
                onChangeText={setSellAmount}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.usdValue}>
                ${sellAmount ? (parseFloat(sellAmount) * sellToken.price).toFixed(2) : '0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={handleSwapTokens}>
          <Icon name="swap-vertical" size={20} color={theme.colors.accent} />
        </TouchableOpacity>

        {/* Buy Section */}
        <View style={styles.tokenSection}>
          <Text style={styles.sectionLabel}>Buying</Text>
          <View style={styles.tokenInput}>
            <TouchableOpacity
              style={styles.tokenSelector}
              onPress={() => openTokenSelector('buy')}
            >
              <View style={[styles.tokenIcon, { backgroundColor: getTokenColor(buyToken.symbol) }]}>
                <Icon name={buyToken.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.tokenSymbol}>{buyToken.symbol}</Text>
              <Icon name="chevron-down" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.amountInput}>
              <Text style={styles.amountText}>{buyAmount || '0.00'}</Text>
              <Text style={styles.usdValue}>
                ${buyAmount ? (parseFloat(buyAmount) * buyToken.price).toFixed(2) : '0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Trade Button */}
        <TouchableOpacity
          style={[styles.tradeButton, isLoading && styles.tradeButtonDisabled]}
          onPress={handleTrade}
          disabled={isLoading || !sellAmount}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={styles.tradeButtonText}>
              Swap
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* User Holdings */}
      <View style={styles.holdingsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>
        </View>
        
        {userHoldings.length > 0 ? (
          userHoldings.map((token) => (
            <View key={token.symbol} style={styles.holdingItem}>
              <View style={styles.holdingInfo}>
                <View style={[styles.tokenIcon, { backgroundColor: getTokenColor(token.symbol) }]}>
                  <Icon name={token.icon as any} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.holdingDetails}>
                  <Text style={styles.holdingSymbol}>{token.symbol}</Text>
                  <Text style={styles.holdingAmount}>
                    {token.balance?.toLocaleString()} {token.symbol}
                  </Text>
                </View>
              </View>
              <View style={styles.holdingValue}>
                <Text style={styles.holdingValueText}>
                  ${((token.balance || 0) * token.price).toFixed(2)}
                </Text>
                <View style={styles.holdingActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleHoldingsAction(token, 'buy')}
                  >
                    <Text style={styles.actionButtonText}>Buy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.sellButton]}
                    onPress={() => handleHoldingsAction(token, 'sell')}
                  >
                    <Text style={[styles.actionButtonText, styles.sellButtonText]}>Sell</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyHoldings}>
            <Icon name="wallet-outline" size={32} color={theme.colors.textSecondary} />
            <Text style={styles.emptyHoldingsText}>No holdings found</Text>
            <Text style={styles.emptyHoldingsSubtext}>
              Connect your wallet to see your tokens
            </Text>
          </View>
        )}
      </View>

      {/* Token Selector Modal */}
      <Modal
        visible={showTokenSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTokenSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {selectorType === 'sell' ? 'Sell' : 'Buy'} Token
              </Text>
              <TouchableOpacity onPress={() => setShowTokenSelector(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={MOCK_TOKENS}
              renderItem={renderTokenItem}
              keyExtractor={(item) => item.symbol}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  tradeContainer: {
    padding: 20,
    backgroundColor: theme.colors.card,
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: theme.colors.accent + '20',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  modeTextActive: {
    color: theme.colors.accent,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  routeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  refreshButton: {
    padding: 4,
  },
  tokenSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  tokenInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  tokenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  amountInput: {
    flex: 1,
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'right',
  },
  usdValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  swapButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tradeButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  tradeButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  tradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  holdingsSection: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  holdingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holdingDetails: {
    marginLeft: 12,
  },
  holdingSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  holdingAmount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  holdingValue: {
    alignItems: 'flex-end',
  },
  holdingValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  holdingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.accent + '20',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  sellButton: {
    backgroundColor: theme.colors.error + '20',
  },
  sellButtonText: {
    color: theme.colors.error,
  },
  emptyHoldings: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyHoldingsText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyHoldingsSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
    maxHeight: '70%',
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
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tokenItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenItemDetails: {
    marginLeft: 12,
  },
  tokenItemSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  tokenItemName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tokenItemPrice: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default TradeScreen; 