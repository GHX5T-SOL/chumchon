// src/screens/details/TutorialScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthProvider';
import { 
  Tutorial, 
  TutorialStep, 
  getTutorialById, 
  hasTutorialCompleted, 
  completeTutorial 
} from '../../services/tutorialService';

type TutorialScreenRouteProp = RouteProp<MainStackParamList, 'Tutorial'>;
type TutorialScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

const TutorialScreen = () => {
  const route = useRoute<TutorialScreenRouteProp>();
  const navigation = useNavigation<TutorialScreenNavigationProp>();
  const { tutorialId } = route.params;
  const { user } = useAuth();
  
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Load tutorial
  useEffect(() => {
    const loadTutorial = async () => {
      setLoading(true);
      try {
        // Load tutorial data
        const tutorialData = await getTutorialById(tutorialId);
        
        if (tutorialData) {
          setTutorial(tutorialData);
          
          // Check if user has completed this tutorial
          if (user) {
            const isCompleted = await hasTutorialCompleted(user.publicKey, tutorialId);
            setCompleted(isCompleted);
          }
        }
      } catch (error) {
        console.error('Failed to load tutorial:', error);
        Alert.alert('Error', 'Failed to load tutorial. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTutorial();
  }, [tutorialId, user]);

  // Handle next step
  const handleNextStep = () => {
    if (!tutorial) return;
    
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      // Last step, complete tutorial
      handleCompleteTutorial();
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  // Handle complete tutorial
  const handleCompleteTutorial = async () => {
    if (!tutorial || !user || completed || processing) return;
    
    setProcessing(true);
    try {
      await completeTutorial(
        user.publicKey,
        tutorialId,
        tutorial.rewardAmount
      );
      
      setCompleted(true);
      Alert.alert(
        'Tutorial Completed!',
        `Congratulations! You've earned ${tutorial.rewardAmount / 1000000000} SOL.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to complete tutorial:', error);
      Alert.alert('Error', 'Failed to complete tutorial. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading tutorial...</Text>
      </View>
    );
  }

  if (!tutorial) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load tutorial</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStepData = tutorial.steps[currentStep];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tutorial.title}</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / tutorial.steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {tutorial.steps.length}
        </Text>
      </View>
      
      {/* Tutorial Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        
        {currentStepData.imageUrl && (
          <Image 
            source={{ uri: currentStepData.imageUrl }} 
            style={styles.stepImage}
            resizeMode="contain"
          />
        )}
        
        <Text style={styles.stepContent}>{currentStepData.content}</Text>
        
        {completed && currentStep === tutorial.steps.length - 1 && (
          <View style={styles.completedContainer}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
            <Text style={styles.completedText}>Tutorial Completed!</Text>
            <Text style={styles.rewardText}>
              You earned {tutorial.rewardAmount / 1000000000} SOL
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentStep === 0 && styles.disabledButton]}
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.navButton, 
            styles.nextButton,
            processing && styles.disabledButton
          ]}
          onPress={handleNextStep}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <>
              <Text style={styles.navButtonText}>
                {currentStep === tutorial.steps.length - 1 ? 'Complete' : 'Next'}
              </Text>
              <Ionicons 
                name={currentStep === tutorial.steps.length - 1 ? "checkmark" : "arrow-forward"} 
                size={20} 
                color={theme.colors.white} 
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerRight: {
    width: 24, // To balance the header
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: theme.colors.cardDark,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for navigation buttons
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  stepImage: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: theme.colors.cardDark,
  },
  stepContent: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
    backgroundColor: theme.colors.cardDark,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginTop: 16,
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  prevButton: {
    backgroundColor: theme.colors.cardDark,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: theme.colors.text,
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
});

export default TutorialScreen;