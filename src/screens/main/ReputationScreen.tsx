import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { cyberpunkStyles, theme } from '../../theme';
import { useAuth } from '../../contexts/AuthProvider';
import { getUserProfile } from '../../services/profileService';
import { useSolana } from '../../contexts/SolanaProvider';

// Placeholder for reputation milestones
const REPUTATION_MILESTONES = [
  { score: 0, label: 'Newbie', color: theme.colors.cyberBlue },
  { score: 100, label: 'Chum', color: theme.colors.cyberGreen },
  { score: 500, label: 'OG', color: theme.colors.cyberYellow },
  { score: 1000, label: 'Whale', color: theme.colors.cyberRed },
  { score: 5000, label: 'Legend', color: theme.colors.primary },
];

const ReputationScreen = () => {
  const { publicKey } = useSolana();
  const [reputation, setReputation] = useState<number | null>(null);
  useEffect(() => {
    let isMounted = true;
    const fetchReputation = async () => {
      if (!publicKey) return setReputation(0);
      try {
        const profile = await getUserProfile(publicKey);
        if (isMounted) setReputation(profile?.reputationScore ?? 0);
      } catch {
        if (isMounted) setReputation(0);
      }
    };
    fetchReputation();
    return () => { isMounted = false; };
  }, [publicKey]);

  const currentMilestone = REPUTATION_MILESTONES.reduce((acc, m) => (reputation !== null && reputation >= m.score ? m : acc), REPUTATION_MILESTONES[0]);
  const nextMilestone = REPUTATION_MILESTONES.find(m => reputation !== null && reputation < m.score);
  const progress = nextMilestone ? Math.min(1, (reputation! - currentMilestone.score) / (nextMilestone.score - currentMilestone.score)) : 1;

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background, padding: 24 }, cyberpunkStyles.animePanel]}>
      <Text style={[cyberpunkStyles.neonGlow, styles.title]}>Reputation</Text>
      {reputation === null ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <>
          <Text style={styles.score}>{reputation} pts</Text>
          <Text style={styles.milestone}>{currentMilestone.label}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: currentMilestone.color }]} />
          </View>
          <Text style={styles.nextMilestoneText}>
            {nextMilestone ? `Next: ${nextMilestone.label} (${nextMilestone.score} pts)` : 'Max reputation achieved!'}
          </Text>
          <FlatList
            data={REPUTATION_MILESTONES}
            keyExtractor={item => item.label}
            renderItem={({ item }) => (
              <View style={[styles.milestoneItem, item.label === currentMilestone.label && styles.currentMilestone]}> 
                <Text style={[styles.milestoneLabel, { color: item.color }]}>{item.label}</Text>
                <Text style={styles.milestoneScore}>{item.score} pts</Text>
              </View>
            )}
            style={{ marginTop: 24 }}
          />
        </>
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
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  milestone: {
    fontSize: 18,
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBarBg: {
    height: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
  },
  nextMilestoneText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 8,
  },
  currentMilestone: {
    backgroundColor: theme.colors.highlight,
    borderRadius: 8,
  },
  milestoneLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  milestoneScore: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default ReputationScreen; 