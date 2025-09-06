// src/contexts/SolanaProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Buffer } from 'buffer';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  AuthorizeAPI,
  DeauthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNetwork } from '../services/programService';

// Storage keys following Solana MWA best practices
const AUTH_TOKEN_KEY = 'authToken';
const BASE64_ADDRESS_KEY = 'base64Address';

// App identity information with your domain
const APP_IDENTITY = {
  name: 'Chumchon',
  uri: 'https://chumchon.app',
  icon: '/favicon.ico', // Full path resolves to https://chumchon.app/favicon.ico
};

// Define the context type
interface SolanaContextType {
  connection: Connection | null;
  network: string;
  connected: boolean;
  publicKey: PublicKey | null;
  connecting: boolean;
  authorizationInProgress: boolean;
  authorizeSession: () => Promise<void>;
  authorizeSessionWithSignIn: () => Promise<void>;
  deauthorizeSession: () => Promise<void>;
  signAndSendTransaction: (transaction: Transaction | VersionedTransaction) => Promise<string>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  disconnect: () => Promise<void>;
}

// Create the context with default values
const SolanaContext = createContext<SolanaContextType>({
  connection: null, // Changed from getConnection() to null
  network: getNetwork(),
  connected: false,
  publicKey: null,
  connecting: false,
  authorizationInProgress: false,
  authorizeSession: async () => {},
  authorizeSessionWithSignIn: async () => {},
  deauthorizeSession: async () => {},
  signAndSendTransaction: async () => '',
  signMessage: async () => new Uint8Array(),
  disconnect: async () => {},
});

// Provider props type
interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  // Defer connection creation to after component mount
  const [connection, setConnection] = useState<Connection | null>(null);
  const [network] = useState<string>(getNetwork());
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [authorizationInProgress, setAuthorizationInProgress] = useState<boolean>(false);
  const [authorizationResult, setAuthorizationResult] = useState<{
    authToken?: string;
    publicKey?: string;
  } | null>(null);

  // Initialize connection immediately
  useEffect(() => {
    import('../services/programService').then(({ getConnection }) => {
      setConnection(getConnection());
    });
  }, []);

  // Load saved authorization on startup - following Solana MWA best practices
  useEffect(() => {
    let isMounted = true;
    
    const loadAuthorization = async () => {
      try {
        // Check for cached authorization using Solana's recommended keys
        const [cachedAuthToken, cachedBase64Address] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(BASE64_ADDRESS_KEY),
        ]);
        
        if (cachedBase64Address && cachedAuthToken && isMounted) {
          try {
            // Convert base64 address to PublicKey
            const pubkeyAsByteArray = Buffer.from(cachedBase64Address, 'base64');
            const cachedPublicKey = new PublicKey(pubkeyAsByteArray);
            
            const cachedAuthResult = {
              authToken: cachedAuthToken,
              publicKey: cachedPublicKey.toString(),
            };
            
            setAuthorizationResult(cachedAuthResult);
            setPublicKey(cachedPublicKey);
            setConnected(true);
            console.log('[SolanaProvider] Loaded cached authorization:', cachedPublicKey.toString());
          } catch (publicKeyError) {
            console.error('Invalid cached publicKey:', publicKeyError);
            // Clear corrupt data
            await Promise.all([
              AsyncStorage.removeItem(AUTH_TOKEN_KEY),
              AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
            ]);
            setAuthorizationResult(null);
            setPublicKey(null);
            setConnected(false);
          }
        }
      } catch (error) {
        console.error('Failed to load authorization:', error);
        // Clear any corrupt data
        await Promise.all([
          AsyncStorage.removeItem(AUTH_TOKEN_KEY),
          AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
        ]);
        setAuthorizationResult(null);
        setPublicKey(null);
        setConnected(false);
      }
    };

    // Defer loading authorization to prevent blocking the main thread
    const timer = setTimeout(loadAuthorization, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

    // Authorize session with a wallet
  const authorizeSession = async () => {
    if (authorizationInProgress) return;
    
    setAuthorizationInProgress(true);
    setConnecting(true);
    
    try {
      const authResult = await transact(async (wallet: AuthorizeAPI & ReauthorizeAPI) => {
        // Try to reauthorize if we have an auth token
        if (authorizationResult?.authToken) {
          try {
            return await wallet.reauthorize({
              auth_token: authorizationResult.authToken,
              identity: APP_IDENTITY,
            });
          } catch (e) {
            console.log('Reauthorization failed, falling back to authorization', e);
            // Clear invalid token
            setAuthorizationResult(null);
            await Promise.all([
              AsyncStorage.removeItem(AUTH_TOKEN_KEY),
              AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
            ]);
          }
        }
        
        // If reauthorization fails or we don't have an auth token, authorize
        return await wallet.authorize({
          chain: 'solana:devnet', // Use proper chain format
          identity: APP_IDENTITY,
        });
      });
      
      console.log('[SolanaProvider] Authorization result:', authResult);
      
      // Save the authorization result
      const walletPublicKey = authResult.accounts[0].address;
      console.log('[SolanaProvider] Received address from wallet:', walletPublicKey);
      
      // Decode base64 address to bytes, then create PublicKey
      const pubkeyBytes = Buffer.from(walletPublicKey, 'base64');
      const newPublicKey = new PublicKey(pubkeyBytes);
      console.log('[SolanaProvider] Decoded public key:', newPublicKey.toString());
      
      // Cache authorization following Solana MWA best practices
      const firstAccount = authResult.accounts[0];
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, authResult.auth_token),
        AsyncStorage.setItem(BASE64_ADDRESS_KEY, firstAccount.address),
      ]);
      
      const newAuthResult = {
        authToken: authResult.auth_token,
        publicKey: newPublicKey.toString(), // Save as base58 string
      };
      setAuthorizationResult(newAuthResult);
      setPublicKey(newPublicKey);
      setConnected(true);
      console.log('[SolanaProvider] Authorization succeeded, state updated:', { connected: true, publicKey: newPublicKey.toString() });
    } catch (error) {
      console.error('Authorization error:', error);
      if (error instanceof Error) {
        console.error('Authorization error stack:', error.stack);
      }
      console.error('Authorization error details:', {
        APP_IDENTITY,
        hasAuthToken: !!authorizationResult?.authToken
      });
      
      // Handle cancellation exception specifically
      if (error instanceof Error && error.message.includes('CancellationException')) {
        console.log('[SolanaProvider] Connection was cancelled by user or wallet');
        // Clear invalid token on cancellation
        await Promise.all([
          AsyncStorage.removeItem(AUTH_TOKEN_KEY),
          AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
        ]);
        setAuthorizationResult(null);
        setPublicKey(null);
        setConnected(false);
        throw new Error('Wallet connection was cancelled. Please try again.');
      }
      
      throw error;
    } finally {
      setAuthorizationInProgress(false);
      setConnecting(false);
    }
  };

  // Authorize session with Sign In with Solana (SIWS)
  const authorizeSessionWithSignIn = async () => {
    if (authorizationInProgress) return;
    
    setAuthorizationInProgress(true);
    setConnecting(true);
    
    try {
      const authResult = await transact(async (wallet: AuthorizeAPI & ReauthorizeAPI) => {
        return await wallet.authorize({
          chain: 'solana:devnet',
          identity: APP_IDENTITY,
          sign_in_payload: {
            domain: 'chumchon.app',
            statement: 'Sign into Chumchon - Decentralized Social App',
            uri: 'https://chumchon.app',
          },
        });
      });
      
      console.log('[SolanaProvider] SIWS Authorization result:', authResult);
      
      if (authResult.sign_in_result) {
        console.log('[SolanaProvider] Sign in result:', authResult.sign_in_result);
        // Here you could verify the SIWS signature
        // const isValid = verifySIWS(input, authResult.sign_in_result);
      }
      
      // Save the authorization result
      const walletPublicKey = authResult.accounts[0].address;
      const pubkeyBytes = Buffer.from(walletPublicKey, 'base64');
      const newPublicKey = new PublicKey(pubkeyBytes);
      
      const newAuthResult = {
        authToken: authResult.auth_token,
        publicKey: newPublicKey.toString(),
      };
      
      // Cache authorization following Solana MWA best practices
      const firstAccount = authResult.accounts[0];
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, authResult.auth_token),
        AsyncStorage.setItem(BASE64_ADDRESS_KEY, firstAccount.address),
      ]);
      setAuthorizationResult(newAuthResult);
      setPublicKey(newPublicKey);
      setConnected(true);
            console.log('[SolanaProvider] SIWS Authorization succeeded');
    } catch (error) {
      console.error('SIWS Authorization error:', error);
      throw error;
    } finally {
      setAuthorizationInProgress(false);
      setConnecting(false);
    }
  };

  // Deauthorize session
  const deauthorizeSession = async () => {
    if (!authorizationResult?.authToken) return;
    
    try {
      await transact(async (wallet: DeauthorizeAPI) => {
        await wallet.deauthorize({ auth_token: authorizationResult.authToken || '' });
      });
      
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
      ]);
      setAuthorizationResult(null);
      setPublicKey(null);
      setConnected(false);
    } catch (error) {
      console.error('Deauthorization error:', error);
    }
  };

  // Sign and send a transaction
  const signAndSendTransaction = async (transaction: Transaction | VersionedTransaction): Promise<string> => {
    if (!connected || !authorizationResult?.authToken || !connection) {
      throw new Error('Wallet not connected or connection not established');
    }
    
    try {
      const signedTransaction = await transact(async (wallet) => {
        const result = await wallet.signTransactions({
          transactions: [transaction],
        });
        return (result as any).signed_transactions[0];
      });
      
      // Send the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  };

  // Sign a message
  const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    if (!connected || !authorizationResult?.authToken) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await transact(async (wallet) => {
        const result = await wallet.signMessages({
          addresses: [authorizationResult?.publicKey || ''],
          payloads: [message],
        });
        return (result as any).signed_payloads[0];
      });
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  };

  // Disconnect wallet - following Solana MWA best practices
  const disconnect = async () => {
    if (!authorizationResult?.authToken) {
      console.log('[SolanaProvider] No current account to disconnect');
      return;
    }
    
    try {
      await transact(async (wallet: DeauthorizeAPI) => {
        await wallet.deauthorize({ auth_token: authorizationResult.authToken || '' });
      });
      
      // Clear all cached authorization data
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
      ]);
      
      setAuthorizationResult(null);
      setPublicKey(null);
      setConnected(false);
      console.log('[SolanaProvider] Wallet disconnected and cache cleared');
    } catch (error) {
      console.error('Disconnect error:', error);
      // Even if deauthorize fails, clear the cache
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(BASE64_ADDRESS_KEY),
      ]);
      setAuthorizationResult(null);
      setPublicKey(null);
      setConnected(false);
    }
  };

  const value = {
    connection,
    network,
    connected,
    publicKey,
    connecting,
    authorizationInProgress,
    authorizeSession,
    authorizeSessionWithSignIn,
    deauthorizeSession,
    signAndSendTransaction,
    signMessage,
    disconnect,
  };

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
};

// Custom hook to use the Solana context
export const useSolana = () => useContext(SolanaContext);