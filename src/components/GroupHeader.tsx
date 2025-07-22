// src/components/GroupHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

interface GroupHeaderProps {
  name: string;
  description: string;
  memberCount: number;
  isChannel: boolean;
  onInfoPress?: () => void;
  onInvitePress?: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
  name,
  description,
  memberCount,
  isChannel,
  onInfoPress,
  onInvitePress,
}) => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{name}</Text>
        <Text style={styles.groupMeta}>
          {isChannel ? 'Channel' : 'Group'} • {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </Text>
      </View>
      
      <View style={styles.actions}>
        {onInvitePress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onInvitePress}
          >
            <Ionicons name="person-add" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        
        {onInfoPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onInfoPress}
          >
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  groupMeta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default GroupHeader;