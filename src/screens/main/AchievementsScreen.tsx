import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { cyberpunkStyles, theme } from '@/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserProfile } from '@/services/profileService';
import { useSolana } from '@/contexts/SolanaProvider';

// Placeholder achievements
const ACHIEVEMENTS = [
  { key: 'first_group', label: 'First Group Joined', icon: 'account-group', check: (profile: any) => !!profile?.joinedFirstGroup },
  { key: 'first_meme', label: 'First Meme Posted', icon: 'emoticon', check: (profile: any) => !!profile?.postedFirstMeme },
  { key: 'tipper', label: '10 Tips Sent', icon: 'hand-coin', check: (profile: any) => (profile?.tipsSent ?? 0) >= 10 },
  { key: 'whale', label: 'Whale Group Member', icon: 'whale', check: (profile: any) => !!profile?.isWhaleGroupMember },
  { key: 'onboarded', label: 'Completed Onboarding', icon: 'rocket-launch', check: (profile: any) => (profile?.completedTutorials?.length ?? 0) >= 5 },
  { key: 'reputation_og', label: 'OG Reputation', icon: 'star', check: (profile: any) => (profile?.reputationScore ?? 0) >= 500 },
];

const AchievementsScreen = () => {
  const { publicKey } = useSolana();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAchievements = async () => {
      setLoading(true);
      let profile: any = {};
      if (publicKey) {
        try {
          profile = await getUserProfile(publicKey);
        } catch {}
      }
      const computed = ACHIEVEMENTS.map(a => ({ ...a, unlocked: a.check(profile) }));
      if (isMounted) setAchievements(computed);
      setLoading(false);
    };
    fetchAchievements();
    return () => { isMounted = false; };
  }, [publicKey]);

  const renderItem = ({ item }: { item: typeof ACHIEVEMENTS[0] }) => (
    <View style={[styles.badge, item.unlocked ? cyberpunkStyles.neonBorder : styles.lockedBadge]}>
      <Icon
        name={item.icon}
        size={40}
        color={item.unlocked ? theme.colors.accent : theme.colors.disabled}
        style={item.unlocked ? cyberpunkStyles.neonGlow : {}}
      />
      <Text style={[styles.badgeLabel, { color: item.unlocked ? theme.colors.text : theme.colors.disabled }]}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background, padding: 24 }, cyberpunkStyles.animePanel]}>
      <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Achievements</Text>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.xxl,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    margin: 12,
    padding: 16,
    borderRadius: theme.roundness * 2,
    backgroundColor: theme.colors.card,
    minWidth: 140,
    minHeight: 120,
  },
  lockedBadge: {
    opacity: 0.4,
    borderColor: theme.colors.disabled,
    borderWidth: 1,
  },
  badgeLabel: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AchievementsScreen; 