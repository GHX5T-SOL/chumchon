// src/contexts/SolanaProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  AuthorizeAPI,
  DeauthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNetwork } from '@/services/programService';

// Storage keys
const WALLET_AUTH_KEY = 'chumchon_wallet_auth';

// App identity information (ideally would come from environment variables)
const APP_NAME = process.env.APP_NAME || 'Chumchon App';
const APP_URI = process.env.APP_URI || 'https://example.com';
const APP_ICON = process.env.APP_ICON || ''; // Empty to omit icon

// Define the context type
interface SolanaContextType {
  connection: Connection | null;
  network: string;
  connected: boolean;
  publicKey: PublicKey | null;
  connecting: boolean;
  authorizationInProgress: boolean;
  authorizeSession: () => Promise<void>;
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
    import('@/services/programService').then(({ getConnection }) => {
      setConnection(getConnection());
    });
  }, []);

  // Load saved authorization on startup - with debounce
  useEffect(() => {
    let isMounted = true;
    
    const loadAuthorization = async () => {
      try {
        const savedAuth = await AsyncStorage.getItem(WALLET_AUTH_KEY);
        if (savedAuth && isMounted) {
          const auth = JSON.parse(savedAuth);
          
          // Validate the stored publicKey before setting it
          if (auth.publicKey) {
            try {
              new PublicKey(auth.publicKey); // Throws if invalid base58
              setAuthorizationResult(auth);
              setPublicKey(new PublicKey(auth.publicKey));
              setConnected(true);
            } catch (publicKeyError) {
              console.error('Invalid stored publicKey:', publicKeyError);
              // Clear corrupt data
              await AsyncStorage.removeItem(WALLET_AUTH_KEY);
              setAuthorizationResult(null);
              setPublicKey(null);
              setConnected(false);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load authorization:', error);
        // Clear any corrupt data
        await AsyncStorage.removeItem(WALLET_AUTH_KEY);
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
            const identity = {
              name: APP_NAME,
              uri: APP_URI,
            };
            
            // Only include icon if it's provided
            if (APP_ICON) {
              identity.icon = APP_ICON;
            }
            
            return await wallet.reauthorize({
              auth_token: authorizationResult.authToken,
              identity,
            });
                      } catch (e) {
              console.log('Reauthorization failed, falling back to authorization', e);
              // Clear invalid token
              setAuthorizationResult(null);
              await AsyncStorage.removeItem(WALLET_AUTH_KEY);
            }
        }
        
        // If reauthorization fails or we don't have an auth token, authorize
        const identity = {
          name: APP_NAME,
          uri: APP_URI,
        };
        
        // Only include icon if it's provided
        if (APP_ICON) {
          identity.icon = APP_ICON;
        }
        
        return await wallet.authorize({
          cluster: 'devnet', // Explicitly set to devnet to match the network
          identity,
        });
      });
      
      console.log('[SolanaProvider] Authorization result:', authResult);
      
      // Save the authorization result
      const walletPublicKey = authResult.accounts[0].address;
      console.log('[SolanaProvider] Received address from wallet:', walletPublicKey);
      const newAuthResult = {
        authToken: authResult.auth_token,
        publicKey: walletPublicKey,
      };
      
      await AsyncStorage.setItem(WALLET_AUTH_KEY, JSON.stringify(newAuthResult));
      setAuthorizationResult(newAuthResult);
      setPublicKey(new PublicKey(walletPublicKey));
      setConnected(true);
      console.log('[SolanaProvider] Authorization succeeded, state updated:', { connected: true, publicKey: walletPublicKey });
    } catch (error) {
      console.error('Authorization error:', error);
      console.error('Authorization error stack:', error.stack);
      console.error('Authorization error details:', {
        APP_NAME,
        APP_URI,
        APP_ICON,
        hasAuthToken: !!authorizationResult?.authToken
      });
      
      // Handle cancellation exception specifically
      if (error instanceof Error && error.message.includes('CancellationException')) {
        console.log('[SolanaProvider] Connection was cancelled by user or wallet');
        // Clear invalid token on cancellation
        await AsyncStorage.removeItem(WALLET_AUTH_KEY);
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

  // Deauthorize session
  const deauthorizeSession = async () => {
    if (!authorizationResult?.authToken) return;
    
    try {
      await transact(async (wallet: DeauthorizeAPI) => {
        await wallet.deauthorize({ auth_token: authorizationResult.authToken });
      });
      
      await AsyncStorage.removeItem(WALLET_AUTH_KEY);
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
        const { signed_transactions } = await wallet.signTransactions({
          transactions: [transaction],
        });
        return signed_transactions[0];
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
        const { signed_payloads } = await wallet.signMessages({
          payloads: [message],
        });
        return signed_payloads[0];
      });
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    await deauthorizeSession();
  };

  const value = {
    connection,
    network,
    connected,
    publicKey,
    connecting,
    authorizationInProgress,
    authorizeSession,
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