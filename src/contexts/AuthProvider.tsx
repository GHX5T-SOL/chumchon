// src/contexts/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSolana } from '@/contexts/SolanaProvider';

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
  const { connected, publicKey, authorizeSession, disconnect } = useSolana();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Changed from true to false
  const [profileService, setProfileService] = useState<any>(null);

  // Dynamically import the profile service to prevent blocking the main thread
  useEffect(() => {
    let isMounted = true;
    
    const loadProfileService = async () => {
      try {
        const module = await import('@/services/profileService');
        if (isMounted) {
          setProfileService(module);
        }
      } catch (error) {
        console.error('Failed to load profile service:', error);
      }
    };
    
    // Defer loading the profile service
    const timer = setTimeout(loadProfileService, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Load saved profile on startup and when wallet connects - with debounce
  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      if (!connected || !publicKey || !profileService) {
        if (isMounted) {
          setUserProfile(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Try to fetch profile from blockchain
        const profile = await profileService.getUserProfile(publicKey);
        
        if (profile && isMounted) {
          setUserProfile(profile);
          setIsAuthenticated(true);
          // Save to local storage for offline access
          await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        } else if (isMounted) {
          // If no profile on chain, check local storage
          const savedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            // Only use if it matches current wallet
            if (parsedProfile.owner === publicKey.toBase58()) {
              setUserProfile(parsedProfile);
              setIsAuthenticated(true);
            } else {
              setUserProfile(null);
              setIsAuthenticated(false);
            }
          } else {
            setUserProfile(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        if (isMounted) {
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Defer profile loading to prevent blocking the main thread
    const timer = setTimeout(loadProfile, 700);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [connected, publicKey, profileService]);

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
    if (!connected || !publicKey || !profileService) {
      throw new Error('Wallet not connected or services not loaded');
    }
    
    setIsLoading(true);
    try {
      const newProfile = await profileService.createUserProfile(publicKey, username, bio);
      setUserProfile(newProfile);
      setIsAuthenticated(true);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Create profile failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
    if (!connected || !publicKey || !profileService) {
      throw new Error('Wallet not connected or services not loaded');
    }
    
    setIsLoading(true);
    try {
      const profile = await profileService.getUserProfile(publicKey);
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