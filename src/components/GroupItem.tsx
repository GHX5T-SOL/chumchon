// src/components/GroupItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PublicKey } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';
import { theme } from '@/theme';

interface GroupItemProps {
  address: PublicKey;
  name: string;
  description: string;
  memberCount: number;
  isChannel: boolean;
  isWhaleGroup: boolean;
  lastMessageAt: number;
  creator: PublicKey;
  unreadCount?: number;
}

const GroupItem: React.FC<GroupItemProps> = ({
  address,
  name,
  description,
  memberCount,
  isChannel,
  isWhaleGroup,
  lastMessageAt,
  creator,
  unreadCount = 0,
}) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    // @ts-ignore - Navigation typing
    navigation.navigate('GroupChat', {
      groupAddress: address.toString(),
      groupName: name,
      groupDescription: description,
      memberCount,
      isChannel,
      creator: creator.toString(),
    });
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        {isChannel ? (
          <Ionicons name="megaphone" size={24} color={theme.colors.primary} />
        ) : (
          <Ionicons name="people" size={24} color={theme.colors.primary} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.time}>
            {lastMessageAt > 0
              ? formatDistanceToNow(new Date(lastMessageAt), { addSuffix: true })
              : 'No messages yet'}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          
          <View style={styles.meta}>
            {isWhaleGroup && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Whale</Text>
              </View>
            )}
            
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GroupItem;