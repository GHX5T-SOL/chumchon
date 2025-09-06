// src/screens/main/MemesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { AppPage } from '@/components/app-page'
// Removed Moti animations to simplify startup
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import { shortenAddress } from '@/services/programService';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type MemesScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock data for meme challenges
interface MemeChallenge {
  id: string;
  title: string;
  description: string;
  prompt: string;
  creator: string;
  rewardAmount: number;
  submissionCount: number;
  startTime: number;
  endTime: number;
  winner?: string;
  submissions?: MemeSubmission[];
}

interface MemeSubmission {
  id: string;
  challengeId: string;
  submitter: string;
  imageUrl: string;
  votes: number;
  submittedAt: number;
}

const MOCK_CHALLENGES: MemeChallenge[] = [
  {
    id: 'challenge1',
    title: 'Solana Speed Memes',
    description: 'Create memes about Solana\'s blazing fast speed',
    prompt: 'Solana is the fastest blockchain, show how fast in a meme',
    creator: 'user1',
    rewardAmount: 1,
    submissionCount: 12,
    startTime: Date.now() - 86400000,
    endTime: Date.now() + 86400000,
  },
  {
    id: 'challenge2',
    title: 'Mobile Wallet Memes',
    description: 'Memes about using crypto on mobile',
    prompt: 'Show the future of mobile crypto wallets in a meme',
    creator: 'user2',
    rewardAmount: 0.5,
    submissionCount: 8,
    startTime: Date.now() - 172800000,
    endTime: Date.now() + 43200000,
  },
  {
    id: 'challenge3',
    title: 'NFT Humor',
    description: 'Funny takes on NFT culture',
    prompt: 'Create a meme about NFT collectors',
    creator: 'user3',
    rewardAmount: 0.75,
    submissionCount: 15,
    startTime: Date.now() - 259200000,
    endTime: Date.now() - 86400000,
    winner: 'user4',
  },
  {
    id: 'challenge4',
    title: 'DeFi Jokes',
    description: 'Memes about decentralized finance',
    prompt: 'Show the ups and downs of DeFi in a meme',
    creator: 'user5',
    rewardAmount: 1.25,
    submissionCount: 10,
    startTime: Date.now() - 345600000,
    endTime: Date.now() - 172800000,
    winner: 'user1',
  },
];

// Mock submissions
const MOCK_SUBMISSIONS: MemeSubmission[] = [
  {
    id: 'submission1',
    challengeId: 'challenge1',
    submitter: 'user1',
    imageUrl: 'https://via.placeholder.com/300',
    votes: 24,
    submittedAt: Date.now() - 43200000,
  },
  {
    id: 'submission2',
    challengeId: 'challenge1',
    submitter: 'user2',
    imageUrl: 'https://via.placeholder.com/300',
    votes: 18,
    submittedAt: Date.now() - 36000000,
  },
  {
    id: 'submission3',
    challengeId: 'challenge2',
    submitter: 'user3',
    imageUrl: 'https://via.placeholder.com/300',
    votes: 32,
    submittedAt: Date.now() - 28800000,
  },
];

const MemesScreen = () => {
  console.log('MemesScreen rendered');
  const navigation = useNavigation<MemesScreenNavigationProp>();
  const { publicKey } = useSolana();
  const [challenges, setChallenges] = useState<MemeChallenge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Load challenges
  const loadChallenges = async () => {
    setRefreshing(true);
    try {
      // In a real app, you would fetch challenges from the blockchain
      // For now, use mock data
      setChallenges(MOCK_CHALLENGES);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load challenges on mount
  useEffect(() => {
    loadChallenges();
  }, []);

  // Filter challenges based on active tab
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'active') {
      return challenge.endTime > Date.now();
    } else {
      return challenge.endTime <= Date.now();
    }
  });

  // Handle refresh
  const handleRefresh = () => {
    loadChallenges();
  };

  // Format time remaining
  const formatTimeRemaining = (endTime: number): string => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m remaining`;
  };

  // Render challenge item
  const renderChallengeItem = ({ item, index }: { item: MemeChallenge; index: number }) => {
    const isActive = item.endTime > Date.now();
    const hasSubmitted = MOCK_SUBMISSIONS.some(
      sub => sub.challengeId === item.id && sub.submitter === publicKey?.toBase58()
    );
    
    return (
      <TouchableOpacity 
        style={styles.challengeItem}
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.title} challenge`}
        activeOpacity={0.8}
      >
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{item.title}</Text>
          <View style={styles.rewardContainer}>
            <Icon name="currency-usd" size={16} color={theme.colors.warning} />
            <Text style={styles.rewardText}>{item.rewardAmount} SOL</Text>
          </View>
        </View>
        
        <Text style={styles.challengeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.promptContainer}>
          <Text style={styles.promptLabel}>AI Prompt:</Text>
          <Text style={styles.promptText} numberOfLines={1}>
            "{item.prompt}"
          </Text>
        </View>
        
        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Icon name="image-multiple" size={16} color={theme.colors.muted} />
            <Text style={styles.statText}>{item.submissionCount} submissions</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="account" size={16} color={theme.colors.muted} />
            <Text style={styles.statText}>
              By {shortenAddress(item.creator)}
            </Text>
          </View>
        </View>
        
        <View style={styles.challengeFooter}>
          {isActive ? (
            <>
              <Text style={styles.timeText}>
                {formatTimeRemaining(item.endTime)}
              </Text>
              
              {hasSubmitted ? (
                <View style={styles.submittedBadge}>
                  <Icon name="check" size={12} color={theme.colors.text} />
                  <Text style={styles.submittedText}>Submitted</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={() => {}}
                  accessibilityRole="button"
                  accessibilityLabel={`Submit meme to ${item.title}`}
                >
                  <Text style={styles.submitButtonText}>Submit Meme</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text style={styles.endedText}>Challenge Ended</Text>
              
              {item.winner && (
                <View style={styles.winnerContainer}>
                  <Icon name="trophy" size={16} color={theme.colors.warning} />
                  <Text style={styles.winnerText}>
                    Winner: {shortenAddress(item.winner)}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppPage>
      <FlatList
        data={filteredChallenges}
        renderItem={({ item, index }) => renderChallengeItem({ item, index })}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.challengeList}
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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Meme Challenges</Text>
              <Text style={styles.headerSubtitle}>
                Create and vote on AI-powered memes
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
                  Completed
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="image-multiple" size={48} color={theme.colors.muted} />
            <Text style={styles.emptyText}>
              {activeTab === 'active'
                ? 'No active meme challenges'
                : 'No completed meme challenges'}
            </Text>
            <TouchableOpacity
              style={styles.createChallengeButton}
              onPress={() => navigation.navigate('CreateMeme')}
            >
              <Text style={styles.createChallengeText}>Create Challenge</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('CreateMeme')}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Create Meme Challenge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('MemeChallenge', { challengeAddress: '1' })}>
              <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>View Meme Challenges</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Create challenge button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateMeme')}
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
  challengeList: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for floating button
  },
  challengeItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20', // 20% opacity
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    color: theme.colors.warning,
    fontWeight: '500',
    marginLeft: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    marginBottom: 12,
  },
  promptContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 12,
    marginBottom: 12,
  },
  promptLabel: {
    fontSize: 12,
    color: theme.colors.accent,
    marginBottom: 4,
  },
  promptText: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    marginLeft: 4,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.info,
  },
  endedText: {
    fontSize: 14,
    color: theme.colors.text, // Changed from theme.colors.muted to white
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.roundness,
  },
  submitButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  submittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '20', // 20% opacity
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  submittedText: {
    fontSize: 12,
    color: theme.colors.success,
    marginLeft: 4,
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 14,
    color: theme.colors.warning,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text, // Changed from theme.colors.muted to white
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  createChallengeButton: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.roundness,
  },
  createChallengeText: {
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

export default MemesScreen;