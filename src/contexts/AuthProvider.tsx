// src/contexts/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSolana } from '@/contexts/SolanaProvider';
import * as profileService from '@/services/profileService';

// Define the user profile type
export interface UserProfile {
  owner: PublicKey;
  username: string;
  bio: string;
  profileNft?: PublicKey;
  showBalance: boolean;
  reputationScore: number;
  joinDate: number;
  lastActive: number;
  completedTutorials: number[];
}

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (username: string, bio: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  createProfile: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Storage keys
const USER_PROFILE_KEY = 'chumchon_user_profile';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { connected, publicKey, authorizeSession, disconnect, connection, signAndSendTransaction } = useSolana();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Changed from true to false
  // Removed: const [profileService, setProfileService] = useState<any>(null);

  // Load saved profile on startup and when wallet connects - with debounce
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      if (!connected || !publicKey || !connection) {
        if (isMounted) {
          setUserProfile(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(true);
      try {
        const profile = await profileService.getUserProfile(connection, publicKey);
        if (profile && isMounted) {
          setUserProfile(profile);
          setIsAuthenticated(true);
          await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        } else if (isMounted) {
          // HACKATHON/DEMO BYPASS: If no profile, set a mock profile and allow access
          const mockProfile = {
            owner: publicKey,
            username: 'DemoUser',
            bio: 'This is a demo profile. On-chain profile creation is bypassed for hackathon/demo.',
            showBalance: false,
            reputationScore: 0,
            joinDate: Date.now(),
            lastActive: Date.now(),
            completedTutorials: [],
          };
          setUserProfile(mockProfile);
          setIsAuthenticated(true);
          await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(mockProfile));
        }
      } catch (error) {
        if (isMounted) {
          // HACKATHON/DEMO BYPASS: On error, set a mock profile and allow access
          const mockProfile = {
            owner: publicKey,
            username: 'DemoUser',
            bio: 'This is a demo profile. On-chain profile creation is bypassed for hackathon/demo.',
            showBalance: false,
            reputationScore: 0,
            joinDate: Date.now(),
            lastActive: Date.now(),
            completedTutorials: [],
          };
          setUserProfile(mockProfile);
          setIsAuthenticated(true);
          await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(mockProfile));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
  }, [connected, publicKey, connection]);

  // Login function
  const login = async () => {
    setIsLoading(true);
    try {
      await authorizeSession();
      // Profile loading will be triggered by the useEffect when connected changes
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await disconnect();
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create profile function
  const createProfile = async (username: string, bio: string) => {
    try {
      if (!connected || !publicKey || !connection || !signAndSendTransaction) {
        throw new Error('Wallet not connected or services not loaded');
      }
      await profileService.createUserProfile(connection, signAndSendTransaction, publicKey, username, bio);
    } catch (err) {
      console.error('[AuthProvider] createProfile error:', err);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!connected || !publicKey || !userProfile) {
      throw new Error('Not authenticated');
    }
    setIsLoading(true);
    try {
      // Implement update profile logic here
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    if (!connected || !publicKey || !connection) {
      throw new Error('Wallet not connected or services not loaded');
    }
    setIsLoading(true);
    try {
      const profile = await profileService.getUserProfile(connection, publicKey);
      if (profile) {
        setUserProfile(profile);
        setIsAuthenticated(true);
        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Refresh profile failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    userProfile,
    isLoading,
    login,
    logout,
    createProfile,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);