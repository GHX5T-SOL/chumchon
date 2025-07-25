// src/components/MemeSubmissionItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PublicKey } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';
import { theme } from '@/theme';

interface MemeSubmissionItemProps {
  address: PublicKey;
  challenge: PublicKey;
  submitter: PublicKey;
  imageUrl: string;
  votes: number;
  submittedAt: number;
  submitterUsername?: string;
  isWinner?: boolean;
  onVote?: () => void;
  hasVoted?: boolean;
  canVote?: boolean;
}

const MemeSubmissionItem: React.FC<MemeSubmissionItemProps> = ({
  address,
  challenge,
  submitter,
  imageUrl,
  votes,
  submittedAt,
  submitterUsername = 'Anonymous',
  isWinner = false,
  onVote,
  hasVoted = false,
  canVote = true,
}) => {
  return (
    <View style={[
      styles.container,
      isWinner && styles.winnerContainer
    ]}>
      <View style={styles.header}>
        <Text style={styles.submitterText}>By {submitterUsername}</Text>
        <Text style={styles.timeText}>
          {formatDistanceToNow(new Date(submittedAt), { addSuffix: true })}
        </Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        
        {isWinner && (
          <View style={styles.winnerBadge}>
            <Ionicons name="trophy" size={16} color={theme.colors.white} />
            <Text style={styles.winnerText}>Winner</Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.votesContainer}>
          <Ionicons name="heart" size={16} color={theme.colors.accent} />
          <Text style={styles.votesText}>{votes} votes</Text>
        </View>
        
        {canVote && (
          <TouchableOpacity
            style={[
              styles.voteButton,
              hasVoted && styles.votedButton
            ]}
            onPress={onVote}
            disabled={hasVoted}
          >
            <Ionicons
              name={hasVoted ? "heart" : "heart-outline"}
              size={16}
              color={hasVoted ? theme.colors.white : theme.colors.text}
            />
            <Text style={[
              styles.voteButtonText,
              hasVoted && styles.votedButtonText
            ]}>
              {hasVoted ? 'Voted' : 'Vote'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  winnerContainer: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: theme.colors.cardDark,
  },
  winnerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winnerText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votesText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 4,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  votedButton: {
    backgroundColor: theme.colors.accent,
  },
  voteButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 4,
  },
  votedButtonText: {
    color: theme.colors.white,
  },
});

export default MemeSubmissionItem;