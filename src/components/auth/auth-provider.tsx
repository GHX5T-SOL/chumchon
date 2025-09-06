import { createContext, type PropsWithChildren, use, useMemo } from 'react'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { AppConfig } from '@/constants/app-config'
import { Account, useAuthorization } from '@/components/solana/use-authorization'
import { useMutation } from '@tanstack/react-query'
import * as profileService from '@/services/profileService';
import React from 'react';
import { useSolana } from '@/contexts/SolanaProvider';

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<Account>
  signOut: () => Promise<void>
  createProfile: (username: string, bio: string) => Promise<void>
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { signIn } = useMobileWallet()

  return useMutation({
    mutationFn: async () =>
      await signIn({
        uri: AppConfig.appUri,
      }),
  })
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { disconnect } = useMobileWallet()
  const { accounts, isLoading } = useAuthorization()
  const { connection, publicKey, signAndSendTransaction } = useSolana();
  const signInMutation = useSignInMutation()
  const [profileLoading, setProfileLoading] = React.useState(false);

  const createProfile = async (username: string, bio: string) => {
    if (!connection || !publicKey || !signAndSendTransaction) {
      console.error('[AuthProvider] Missing connection, publicKey, or signAndSendTransaction');
      throw new Error('Wallet not connected');
    }
    setProfileLoading(true);
    try {
      console.log('[AuthProvider] Calling profileService.createUserProfile', { username, bio });
      await profileService.createUserProfile(
        connection,
        signAndSendTransaction,
        publicKey,
        username,
        bio
      );
      console.log('[AuthProvider] Profile created successfully');
    } catch (error) {
      console.error('[AuthProvider] Failed to create profile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const value: AuthState = useMemo(
    () => ({
      signIn: async () => await signInMutation.mutateAsync(),
      signOut: async () => await disconnect(),
      isAuthenticated: (accounts?.length ?? 0) > 0,
      isLoading: signInMutation.isPending || isLoading || profileLoading,
      createProfile,
    }),
    [accounts, disconnect, signInMutation, isLoading, profileLoading, createProfile],
  )

  return <Context value={value}>{children}</Context>
}
