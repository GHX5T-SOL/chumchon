// src/screens/main/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles, cyberpunkStyles } from '@/theme';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';
import { shortenAddress } from '@/services/programService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { userProfile, logout, refreshProfile } = useAuth();
  const { publicKey } = useSolana();
  const [refreshing, setRefreshing] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        },
      ]
    );
  };

  // Calculate completion percentage for tutorials
  const calculateTutorialCompletion = () => {
    if (!userProfile?.completedTutorials) return 0;
    // Assuming there are 5 tutorials total
    return (userProfile.completedTutorials.length / 5) * 100;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.accent]}
          tintColor={theme.colors.accent}
        />
      }
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {userProfile?.profileNft ? (
            <Image
              source={{ uri: 'https://placeholder.com/150' }} // Replace with actual NFT image
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {userProfile?.username ? userProfile.username[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.editProfileImageButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="pencil" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.username}>{userProfile?.username || 'Anonymous'}</Text>
        
        <TouchableOpacity style={styles.walletAddressContainer}>
          <Text style={styles.walletAddress}>
            {publicKey ? shortenAddress(publicKey.toBase58(), 6) : 'Not connected'}
          </Text>
          <Icon name="content-copy" size={16} color={theme.colors.accent} />
        </TouchableOpacity>
        
        <Text style={styles.bio}>{userProfile?.bio || 'No bio yet'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile?.reputationScore || 0}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Date(userProfile?.joinDate || Date.now()).toLocaleDateString()}
            </Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="account-edit" size={20} color={theme.colors.text} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share-variant" size={20} color={theme.colors.text} />
          <Text style={styles.actionText}>Share Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color={theme.colors.error} />
          <Text style={[styles.actionText, { color: theme.colors.error }]}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      {/* Tutorial Progress */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tutorial Progress</Text>
          <Text style={styles.progressText}>{calculateTutorialCompletion()}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${calculateTutorialCompletion()}%` }
            ]} 
          />
        </View>
        
        <TouchableOpacity style={styles.tutorialButton}>
          <Text style={styles.tutorialButtonText}>Continue Learning</Text>
          <Icon name="arrow-right" size={16} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      {/* NFT Collection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your NFTs</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.nftGrid}>
          <View style={styles.emptyNftContainer}>
            <Icon name="image-off" size={32} color={theme.colors.text} />
            <Text style={styles.emptyNftText}>No NFTs found</Text>
            <TouchableOpacity style={styles.browseNftButton}>
              <Text style={styles.browseNftText}>Browse Marketplace</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        
        <View style={styles.emptyActivityContainer}>
          <Icon name="history" size={32} color={theme.colors.text} />
          <Text style={styles.emptyActivityText}>No recent activity</Text>
          <Text style={styles.emptyActivitySubtext}>
            Your interactions will appear here
          </Text>
        </View>
      </View>

      {/* Cyberpunk-styled Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('NFTProfilePicker')}>
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Set NFT Profile Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('Reputation')}>
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>View Reputation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('Achievements')}>
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>View Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, cyberpunkStyles.neonBorder]} onPress={() => navigation.navigate('Settings')}>
          <Text style={[styles.buttonText, cyberpunkStyles.neonGlow]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface + '80', // 50% opacity
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  walletAddress: {
    fontSize: 14,
    color: theme.colors.accent,
    marginRight: 8,
  },
  bio: {
    fontSize: 16,
    color: theme.colors.text + 'CC', // 80% opacity
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.text + 'CC', // 80% opacity
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 4,
  },
  section: {
    padding: 16,
    marginBottom: 16,
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
  progressText: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.accent,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.accent,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tutorialButtonText: {
    fontSize: 16,
    color: theme.colors.accent,
    marginRight: 8,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyNftContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyNftText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 16,
  },
  browseNftButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.buttonSecondary,
    borderRadius: theme.roundness,
  },
  browseNftText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyActivityContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyActivityText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyActivitySubtext: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
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

export default ProfileScreen;