// src/screens/details/MemeChallengeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { AppPage } from '@/components/app-page'
import { MotiView } from 'moti'
import { MotiPressable } from 'moti/interactions'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicKey } from '@solana/web3.js';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, commonStyles } from '@/theme';
import { useAuth } from '@/contexts/AuthProvider';
import { useSolana } from '@/contexts/SolanaProvider';
import { 
  MemeChallenge, 
  MemeSubmission, 
  getMemeChallenges,
  getMemeSubmissions,
  submitMeme, 
  voteForMeme, 
  endMemeChallenge 
} from '@/services/memeService';
import { shortenAddress } from '@/services/programService';
import MemeSubmissionItem from '@/components/MemeSubmissionItem';

const { width } = Dimensions.get('window');

type MemeChallengeScreenRouteProp = RouteProp<MainStackParamList, 'MemeChallenge'>;
type MemeChallengeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock user profiles
const MOCK_USER_PROFILES: Record<string, { username: string }> = {
  'user1': { username: 'SolanaWhale' },
  'user2': { username: 'CryptoNinja' },
  'user3': { username: 'BlockchainDev' },
  'user4': { username: 'TokenMaster' },
};

const MemeChallengeScreen = () => {
  const route = useRoute<MemeChallengeScreenRouteProp>();
  const navigation = useNavigation<MemeChallengeScreenNavigationProp>();
  const { user } = useAuth();
  const { connection, signAndSendTransaction } = useSolana();
  const { challengeId } = route.params;
  
  const [challenge, setChallenge] = useState<MemeChallenge | null>(null);
  const [submissions, setSubmissions] = useState<MemeSubmission[]>([]);
  const [votedSubmissions, setVotedSubmissions] = useState<string[]>([]);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!connection) return;
        
        // Load challenge and submissions
        const challenges = await getMemeChallenges(connection);
        const foundChallenge = challenges.find(c => c.address.toString() === challengeId);
        setChallenge(foundChallenge || null);
        
        if (foundChallenge) {
          const challengeSubmissions = await getMemeSubmissions(connection, foundChallenge.address);
          setSubmissions(challengeSubmissions);
        }
      } catch (error) {
        console.error('Failed to load meme challenge data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [challengeId, connection]);

  const hasUserSubmitted = (): boolean => {
    if (!user || !submissions.length) return false;
    return submissions.some(sub => sub.submitter.toString() === user.publicKey.toString());
  };

  const isCreator = (): boolean => {
    if (!user || !challenge) return false;
    return challenge.creator.toString() === user.publicKey.toString();
  };

  const isActive = (): boolean => {
    if (!challenge) return false;
    return Date.now() >= challenge.startTime && Date.now() <= challenge.endTime;
  };

  const isCompleted = (): boolean => {
    if (!challenge) return false;
    return Date.now() > challenge.endTime;
  };

  // Handle submit meme
  const handleSubmitMeme = async () => {
    if (!challenge || !user || !connection || !signAndSendTransaction || !imageUrl.trim() || !title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setProcessing(true);
    try {
      await submitMeme(
        connection,
        signAndSendTransaction,
        challenge.address,
        user.publicKey,
        imageUrl.trim(),
        title.trim(),
        description.trim()
      );
      
      // Update submissions
      const newSubmission: MemeSubmission = {
        address: new PublicKey('dummy'), // This would be the actual PDA in a real app
        challenge: challenge.address,
        submitter: user.publicKey,
        imageUrl: imageUrl.trim(),
        votes: 0,
        submittedAt: Date.now(),
      };
      
      setSubmissions([...submissions, newSubmission]);
      setSubmitModalVisible(false);
      setImageUrl('');
      setTitle('');
      setDescription('');
      
      Alert.alert('Success', 'Your meme has been submitted!');
    } catch (error) {
      console.error('Failed to submit meme:', error);
      Alert.alert('Error', 'Failed to submit meme. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle vote for meme
  const handleVoteForMeme = async (submission: MemeSubmission) => {
    if (!user || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'You must be logged in to vote');
      return;
    }
    
    if (votedSubmissions.includes(submission.address.toString())) {
      Alert.alert('Error', 'You have already voted for this submission');
      return;
    }
    
    setProcessing(true);
    try {
      await voteForMeme(
        connection,
        signAndSendTransaction,
        submission.challenge,
        submission.submitter,
        user.publicKey
      );
      
      // Update local state
      const updatedSubmissions = submissions.map(sub => {
        if (sub.address.toString() === submission.address.toString()) {
          return {
            ...sub,
            votes: sub.votes + 1,
          };
        }
        return sub;
      });
      
      setSubmissions(updatedSubmissions);
      setVotedSubmissions([...votedSubmissions, submission.address.toString()]);
      
      Alert.alert('Success', 'Your vote has been counted!');
    } catch (error) {
      console.error('Failed to vote for meme:', error);
      Alert.alert('Error', 'Failed to vote. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle end challenge
  const handleEndChallenge = async () => {
    if (!challenge || !user || !connection || !signAndSendTransaction || !isCreator()) return;
    
    // Find the submission with the most votes
    const sortedSubmissions = [...submissions].sort((a, b) => b.votes - a.votes);
    const winner = sortedSubmissions[0];
    
    if (!winner) {
      Alert.alert('Error', 'No submissions to select a winner from');
      return;
    }
    
    setProcessing(true);
    try {
      await endMemeChallenge(
        connection,
        signAndSendTransaction,
        challenge.creator,
        winner.submitter,
        challenge.startTime
      );
      
      Alert.alert('Success', 'Challenge ended successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to end challenge:', error);
      Alert.alert('Error', 'Failed to end challenge. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Render submit modal
  const renderSubmitModal = () => (
    <Modal
      visible={submitModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setSubmitModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Submit Meme</Text>
            <TouchableOpacity
              onPress={() => setSubmitModalVisible(false)}
              disabled={processing}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalLabel}>Image URL</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter image URL"
            placeholderTextColor={theme.colors.textSecondary}
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.modalLabel}>Title</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter meme title"
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.modalLabel}>Description</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter meme description"
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={4}
          />
          
          <TouchableOpacity
            style={[
              styles.modalButton,
              (!imageUrl.trim() || !title.trim() || !description.trim() || processing) && styles.disabledButton
            ]}
            onPress={handleSubmitMeme}
            disabled={!imageUrl.trim() || !title.trim() || !description.trim() || processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.modalButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading challenge details...</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load challenge details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AppPage>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meme Challenge</Text>
          <View style={styles.headerRight} />
        </View>
        
        {/* Challenge Info */}
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="person" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>
                By {MOCK_USER_PROFILES[challenge.creator.toString()]?.username || shortenAddress(challenge.creator.toString())}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="gift" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>
                {challenge.rewardAmount / 1000000000} SOL
              </Text>
            </View>
          </View>
          
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
          
          <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Prompt:</Text>
            <Text style={styles.promptText}>{challenge.prompt}</Text>
          </View>
          
          <View style={styles.timeInfo}>
            {isActive() ? (
              <Text style={styles.timeText}>
                Ends in {Math.ceil((challenge.endTime - Date.now()) / 86400000)} days
              </Text>
            ) : isCompleted() ? (
              <Text style={styles.timeText}>Challenge ended</Text>
            ) : (
              <Text style={styles.timeText}>
                Starts in {Math.ceil((challenge.startTime - Date.now()) / 86400000)} days
              </Text>
            )}
          </View>
        </View>
        
        {/* Submissions */}
        <View style={styles.submissionsContainer}>
          <View style={styles.submissionsHeader}>
            <Text style={styles.submissionsTitle}>Submissions</Text>
            <Text style={styles.submissionsCount}>{submissions.length} entries</Text>
          </View>
          
          {submissions.length === 0 ? (
            <View style={styles.noSubmissions}>
              <Ionicons name="images-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.noSubmissionsText}>No submissions yet</Text>
              <Text style={styles.noSubmissionsSubtext}>Be the first to submit a meme!</Text>
            </View>
          ) : (
            submissions
              .sort((a, b) => b.votes - a.votes) // Sort by votes
              .map((submission, index) => (
                <MemeSubmissionItem
                  key={submission.address.toString()}
                  address={submission.address}
                  challenge={submission.challenge}
                  submitter={submission.submitter}
                  imageUrl={submission.imageUrl}
                  votes={submission.votes}
                  submittedAt={submission.submittedAt}
                  submitterUsername={
                    MOCK_USER_PROFILES[submission.submitter.toString()]?.username || 
                    shortenAddress(submission.submitter.toString())
                  }
                  isWinner={challenge.winner?.toString() === submission.submitter.toString()}
                  onVote={() => handleVoteForMeme(submission)}
                  hasVoted={votedSubmissions.includes(submission.address.toString())}
                  canVote={isActive() && user !== null}
                />
              ))
          )}
        </View>
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {isActive() && !hasUserSubmitted() && user && (
          <MotiPressable from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 250 }} pressStyle={{ scale: 0.98 }} style={styles.submitButton} onPress={() => setSubmitModalVisible(true)}>
            <Ionicons name="add" size={20} color={theme.colors.white} />
            <Text style={styles.submitButtonText}>Submit Meme</Text>
          </MotiPressable>
        )}
        
        {isCompleted() && isCreator() && !challenge.winner && (
          <MotiPressable from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 60, type: 'timing', duration: 250 }} pressStyle={{ scale: 0.98 }} style={styles.endButton} onPress={handleEndChallenge} disabled={processing}>
            {processing ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <>
                <Ionicons name="trophy" size={20} color={theme.colors.white} />
                <Text style={styles.endButtonText}>End Challenge & Reward Winner</Text>
              </>
            )}
          </MotiPressable>
        )}
      </View>
      
      {renderSubmitModal()}
      <MotiPressable from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 120, type: 'timing', duration: 250 }} pressStyle={{ scale: 0.98 }} style={[styles.button, commonStyles.neonBorder]} onPress={() => navigation.navigate('Tip', { groupAddress: challengeId })}>
        <Text style={[styles.buttonText, commonStyles.neonGlow]}>Tip Meme Creator</Text>
      </MotiPressable>
    </AppPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for action buttons
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerRight: {
    width: 24, // To balance the header
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  challengeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  challengeMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  challengeDescription: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  promptContainer: {
    backgroundColor: theme.colors.cardDark,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 4,
  },
  promptText: {
    fontSize: 16,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  timeInfo: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  submissionsContainer: {
    marginBottom: 24,
  },
  submissionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  submissionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  submissionsCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  submissionsLoading: {
    alignItems: 'center',
    padding: 32,
  },
  noSubmissions: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
  },
  noSubmissionsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  noSubmissionsSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  endButton: {
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  endButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
  modalLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: theme.colors.cardDark,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
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

export default MemeChallengeScreen;