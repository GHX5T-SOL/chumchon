// src/navigation/AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/contexts/AuthProvider';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { WalletConnectButton } from '@/components/solana/WalletConnectButton';

// Auth screens
import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import CreateProfileScreen from '@/screens/auth/CreateProfileScreen';

// Main screens
import HomeScreen from '@/screens/main/HomeScreen';
import GroupsScreen from '@/screens/main/GroupsScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import MemesScreen from '@/screens/main/MemesScreen';
import EscrowScreen from '@/screens/main/EscrowScreen';
import ChannelsScreen from '@/screens/main/ChannelsScreen';
import SettingsScreen from '@/screens/main/SettingsScreen';
import AchievementsScreen from '@/screens/main/AchievementsScreen';
import ReputationScreen from '@/screens/main/ReputationScreen';
import NFTProfilePickerScreen from '@/screens/main/NFTProfilePickerScreen';
import CreateGroupScreen from '@/screens/main/CreateGroupScreen';
import JoinGroupScreen from '@/screens/main/JoinGroupScreen';
import CreateEscrowScreen from '@/screens/main/CreateEscrowScreen';
import CreateMemeScreen from '@/screens/main/CreateMemeScreen';

// Detail screens
import GroupChatScreen from '@/screens/details/GroupChatScreen';
import EscrowDetailScreen from '@/screens/details/EscrowDetailScreen';
import MemeChallengeScreen from '@/screens/details/MemeChallengeScreen';
import TutorialScreen from '@/screens/details/TutorialScreen';
import ChannelDetailScreen from '@/screens/details/ChannelDetailScreen';
import InviteScreen from '@/screens/details/InviteScreen';
import TipScreen from '@/screens/details/TipScreen';
import NotFoundScreen from '@/screens/NotFoundScreen';
import OnboardingScreen from '@/screens/auth/OnboardingScreen';

// Define the stack navigator types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  CreateProfile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  GroupChat: { 
    groupAddress: string;
    groupName: string;
    groupDescription: string;
    memberCount: number;
    isChannel: boolean;
    creator: string;
  };
  EscrowDetail: { escrowAddress: string };
  MemeChallenge: { challengeAddress: string };
  Tutorial: { tutorialId: number };
  ChannelDetail: { channelAddress: string };
  Settings: undefined;
  Achievements: undefined;
  Reputation: undefined;
  NFTProfilePicker: undefined;
  Invite: { groupAddress?: string };
  Tip: { groupAddress?: string };
  NotFound: undefined;
  Onboarding: undefined;
  CreateGroup: undefined;
  CreateEscrow: undefined;
  CreateMeme: undefined;
  JoinGroup: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Groups: undefined;
  Channels: undefined;
  Memes: undefined;
  Escrow: undefined;
  Profile: undefined;
};

// Create the navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Auth navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
        headerRight: () => <WalletConnectButton />, // Add button to all auth screens
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="CreateProfile" component={CreateProfileScreen} options={{ title: 'Create Profile' }} />
    </AuthStack.Navigator>
  );
};

// Main tabs navigator
const MainTabsNavigator = () => {
  return (
    <MainTabs.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false, // Hide header since MainNavigator provides it
      }}
    >
      <MainTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Channels"
        component={ChannelsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Memes"
        component={MemesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Escrow"
        component={EscrowScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

// Placeholder screens for missing implementations
const PlaceholderScreen = ({ route, navigation }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <Text style={{ color: theme.colors.text, fontSize: 18 }}>This screen is under construction.</Text>
  </View>
);

// Main navigator
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
        headerRight: () => <WalletConnectButton />, // Add button to all main stack screens
      }}
    >
      <MainStack.Screen 
        name="MainTabs" 
        component={MainTabsNavigator} 
        options={{ title: 'Chumchon' }}
      />
      <MainStack.Screen name="GroupChat" component={GroupChatScreen} />
      <MainStack.Screen name="EscrowDetail" component={EscrowDetailScreen} />
      <MainStack.Screen name="MemeChallenge" component={MemeChallengeScreen} />
      <MainStack.Screen name="Tutorial" component={TutorialScreen} />
      <MainStack.Screen name="ChannelDetail" component={ChannelDetailScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="Achievements" component={AchievementsScreen} />
      <MainStack.Screen name="Reputation" component={ReputationScreen} />
      <MainStack.Screen name="NFTProfilePicker" component={NFTProfilePickerScreen} />
      <MainStack.Screen name="Invite" component={InviteScreen} />
      <MainStack.Screen name="Tip" component={TipScreen} />
      <MainStack.Screen name="NotFound" component={NotFoundScreen} />
      <MainStack.Screen name="Onboarding" component={OnboardingScreen} />
      <MainStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
      <MainStack.Screen name="CreateEscrow" component={CreateEscrowScreen} options={{ title: 'Create Escrow' }} />
      <MainStack.Screen name="CreateMeme" component={CreateMemeScreen} options={{ title: 'Create Meme Challenge' }} />
      <MainStack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ title: 'Join Group' }} />
    </MainStack.Navigator>
  );
};

// Loading component
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: theme.colors.background
  }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

// App navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Add a small delay to ensure UI is responsive during initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady || isLoading) {
    return <LoadingScreen />;
  }
  
  // If authenticated but no profile, show create profile screen
  if (isAuthenticated && !userProfile) {
    return (
      <AuthStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <AuthStack.Screen
          name="CreateProfile"
          component={CreateProfileScreen}
          options={{ title: 'Create Profile' }}
        />
      </AuthStack.Navigator>
    );
  }
  
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;