// src/components/MemeChallengeItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PublicKey } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';
import { theme } from '../theme';

interface MemeChallengeItemProps {
  address: PublicKey;
  creator: PublicKey;
  title: string;
  description: string;
  prompt: string;
  rewardAmount: number;
  submissionCount: number;
  startTime: number;
  endTime: number;
  winner?: PublicKey;
  thumbnailUrl?: string;
}

const MemeChallengeItem: React.FC<MemeChallengeItemProps> = ({
  address,
  creator,
  title,
  description,
  prompt,
  rewardAmount,
  submissionCount,
  startTime,
  endTime,
  winner,
  thumbnailUrl,
}) => {
  const navigation = useNavigation();
  
  const isActive = Date.now() >= startTime && Date.now() <= endTime;
  const isCompleted = Date.now() > endTime;
  const isUpcoming = Date.now() < startTime;
  
  const getStatusText = () => {
    if (isUpcoming) return 'Upcoming';
    if (isActive) return 'Active';
    if (isCompleted) return 'Completed';
    return '';
  };
  
  const getStatusColor = () => {
    if (isUpcoming) return theme.colors.info;
    if (isActive) return theme.colors.success;
    if (isCompleted) return theme.colors.textSecondary;
    return theme.colors.textSecondary;
  };
  
  const handlePress = () => {
    // @ts-ignore - Navigation typing
    navigation.navigate('MemeChallenge', {
      challengeAddress: address.toString(),
    });
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Ionicons name="image-outline" size={32} color={theme.colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.details}>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{submissionCount} submissions</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="gift-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{rewardAmount / 1000000000} SOL</Text>
            </View>
          </View>
          
          <View style={styles.timeContainer}>
            {isUpcoming ? (
              <Text style={styles.timeText}>
                Starts {formatDistanceToNow(new Date(startTime), { addSuffix: true })}
              </Text>
            ) : isActive ? (
              <Text style={styles.timeText}>
                Ends {formatDistanceToNow(new Date(endTime), { addSuffix: true })}
              </Text>
            ) : (
              <Text style={styles.timeText}>
                Ended {formatDistanceToNow(new Date(endTime), { addSuffix: true })}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: theme.colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default MemeChallengeItem;