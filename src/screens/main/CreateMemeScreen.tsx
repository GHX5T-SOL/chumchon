// src/screens/main/CreateMemeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@/navigation/AppNavigator';
import { MainStackParamList } from '@/navigation/AppNavigator';
import { theme, cyberpunkStyles } from '@/theme';
import { useSolana } from '@/contexts/SolanaProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateMemeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CreateMemeScreen = () => {
  const navigation = useNavigation<CreateMemeScreenNavigationProp>();
  const { publicKey, connection, signAndSendTransaction } = useSolana();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [loading, setLoading] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a challenge title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a challenge description');
      return false;
    }
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter an AI prompt');
      return false;
    }
    if (!rewardAmount.trim() || parseFloat(rewardAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid reward amount');
      return false;
    }
    if (!durationHours.trim() || parseInt(durationHours) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return false;
    }
    return true;
  };

  // Handle create challenge
  const handleCreateChallenge = async () => {
    if (!validateForm()) return;
    
    if (!publicKey || !connection || !signAndSendTransaction) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual blockchain call to create meme challenge
      // For now, just simulate the process
      console.log('Creating meme challenge:', {
        title: title.trim(),
        description: description.trim(),
        prompt: prompt.trim(),
        rewardAmount: parseFloat(rewardAmount),
        durationHours: parseInt(durationHours),
        creator: publicKey.toBase58(),
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Meme challenge created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to create meme challenge:', error);
      Alert.alert('Error', 'Failed to create meme challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Meme Challenge</Text>
          <Text style={styles.subtitle}>
            Set up an AI-powered meme contest with SOL rewards
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Challenge Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter challenge title"
              placeholderTextColor={theme.colors.muted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what kind of memes you want"
              placeholderTextColor={theme.colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>AI Prompt</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter the AI prompt for meme generation"
              placeholderTextColor={theme.colors.muted}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              maxLength={300}
            />
            <Text style={styles.charCount}>{prompt.length}/300</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Reward Amount (SOL)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.1"
                placeholderTextColor={theme.colors.muted}
                value={rewardAmount}
                onChangeText={setRewardAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Duration (hours)</Text>
              <TextInput
                style={styles.input}
                placeholder="24"
                placeholderTextColor={theme.colors.muted}
                value={durationHours}
                onChangeText={setDurationHours}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Icon name="information" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              Participants will use AI to generate memes based on your prompt. The best meme wins the reward!
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              cyberpunkStyles.neonBorder,
              loading && styles.disabledButton,
            ]}
            onPress={handleCreateChallenge}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.text} />
            ) : (
              <>
                <Icon name="plus" size={20} color={theme.colors.text} />
                <Text style={[styles.createButtonText, cyberpunkStyles.neonGlow]}>
                  Create Challenge
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.info + '20',
    borderRadius: theme.roundness,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.roundness,
    minWidth: 200,
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CreateMemeScreen; 