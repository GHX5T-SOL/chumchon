// src/screens/main/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { theme, commonStyles } from '../../theme';
import { useAuth } from '../../contexts/AuthProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data for the home screen
const TUTORIALS = [
  { id: '1', title: 'Welcome to Chumchon', description: 'Learn the basics of the app', reward: 0.01, completed: false },
  { id: '2', title: 'Join Your First Group', description: 'Connect with others in a community', reward: 0.02, completed: false },
  { id: '3', title: 'Send Your First Message', description: 'Start a conversation in a group', reward: 0.03, completed: false },
  { id: '4', title: 'Create an Escrow Deal', description: 'Learn how to trade safely', reward: 0.05, completed: false },
  { id: '5', title: 'Submit a Meme', description: 'Participate in a meme challenge', reward: 0.05, completed: false },
];

const RECENT_ACTIVITY = [
  { id: '1', type: 'message', group: 'Solana Developers', time: '5m ago' },
  { id: '2', type: 'escrow', user: 'alex.sol', status: 'completed', time: '1h ago' },
  { id: '3', type: 'group', name: 'NFT Collectors', action: 'joined', time: '3h ago' },
  { id: '4', type: 'meme', challenge: 'Solana Memes', action: 'voted', time: '5h ago' },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { userProfile, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [tutorials, setTutorials] = useState(TUTORIALS);
  const [recentActivity, setRecentActivity] = useState(RECENT_ACTIVITY);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
      // Update tutorials based on completed ones
      if (userProfile?.completedTutorials) {
        const updatedTutorials = tutorials.map(tutorial => ({
          ...tutorial,
          completed: userProfile.completedTutorials.includes(parseInt(tutorial.id)),
        }));
        setTutorials(updatedTutorials);
      }
      // In a real app, you would fetch recent activity here
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    handleRefresh();
  }, [userProfile?.completedTutorials]);

  // Render tutorial item
  const renderTutorialItem = ({ item }: { item: typeof TUTORIALS[0] }) => (
    <TouchableOpacity
      style={[styles.tutorialItem, item.completed && styles.completedTutorial]}
      onPress={() => {
        // Navigate to tutorial or mark as completed
      }}
    >
      <View style={styles.tutorialContent}>
        <Text style={styles.tutorialTitle}>{item.title}</Text>
        <Text style={styles.tutorialDescription}>{item.description}</Text>
        <View style={styles.tutorialReward}>
          <Icon name="coins" size={16} color={theme.colors.warning} />
          <Text style={styles.rewardText}>{item.reward} SOL</Text>
        </View>
      </View>
      <View style={styles.tutorialStatus}>
        {item.completed ? (
          <Icon name="check-circle" size={24} color={theme.colors.success} />
        ) : (
          <Icon name="arrow-right-circle" size={24} color={theme.colors.accent} />
        )}
      </View>
    </TouchableOpacity>
  );

  // Render activity item
  const renderActivityItem = ({ item }: { item: typeof RECENT_ACTIVITY[0] }) => {
    let icon, title, subtitle;
    
    switch (item.type) {
      case 'message':
        icon = 'message-text';
        title = `New messages in ${item.group}`;
        subtitle = item.time;
        break;
      case 'escrow':
        icon = 'swap-horizontal';
        title = `Escrow with ${item.user} ${item.status}`;
        subtitle = item.time;
        break;
      case 'group':
        icon = 'account-group';
        title = `You ${item.action} ${item.name}`;
        subtitle = item.time;
        break;
      case 'meme':
        icon = 'image';
        title = `You ${item.action} in ${item.challenge}`;
        subtitle = item.time;
        break;
      default:
        icon = 'bell';
        title = 'Activity';
        subtitle = item.time;
    }
    
    return (
      <TouchableOpacity style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <Icon name={icon} size={24} color={theme.colors.accent} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityTime}>{subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={theme.colors.muted} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Welcome section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                Welcome, {userProfile?.username || 'Anon'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Your on-chain social experience starts here
              </Text>
            </View>

            {/* Tutorials section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Earn SOL with Tutorials</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={tutorials}
                renderItem={renderTutorialItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tutorialsList}
              />
            </View>

            {/* Recent activity section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>
              <FlatList
                data={recentActivity}
                renderItem={renderActivityItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>

            {/* Quick actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateGroup')}
              >
                <Icon name="account-group-outline" size={24} color={theme.colors.text} />
                <Text style={styles.actionText}>Create Group</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateEscrow')}
              >
                <Icon name="swap-horizontal" size={24} color={theme.colors.text} />
                <Text style={styles.actionText}>New Escrow</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateMeme')}
              >
                <Icon name="image-plus" size={24} color={theme.colors.text} />
                <Text style={styles.actionText}>Meme Challenge</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.accent]}
            tintColor={theme.colors.accent}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: theme.colors.primary,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.text + 'CC', // 80% opacity
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.accent,
  },
  tutorialsList: {
    paddingRight: 16,
  },
  tutorialItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    padding: 16,
    marginRight: 16,
    width: 280,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  completedTutorial: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '10', // 10% opacity
  },
  tutorialContent: {
    flex: 1,
    marginRight: 16,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 12,
  },
  tutorialReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: theme.colors.warning,
    marginLeft: 4,
    fontWeight: '500',
  },
  tutorialStatus: {
    justifyContent: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginVertical: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    marginHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 8,
  },
});

export default HomeScreen;