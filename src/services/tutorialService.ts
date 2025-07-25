// src/services/tutorialService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient, completeTutorial as completeTutorialInstruction } from '../../chumchon_program/app/program_client/rpc';

// Program ID from Anchor.toml
const PROGRAM_ID = new PublicKey('CVjwSHMQ9YTenzKwQczwXWzJFk5kwaUhKDtxDKVazJXj');

// Get program ID for the current environment
const getProgramId = (): PublicKey => {
  return PROGRAM_ID;
};

// Create a wallet adapter for Mobile Wallet Adapter
function makeAnchorWallet(publicKey: PublicKey, signAndSendTransaction: (tx: Transaction) => Promise<string>) {
  return {
    publicKey,
    signTransaction: async (tx: Transaction) => tx,
    signAllTransactions: async (txs: Transaction[]) => txs,
  };
}

// Tutorial interface
export interface Tutorial {
  id: number;
  title: string;
  description: string;
  steps: TutorialStep[];
  rewardAmount: number;
}

// Tutorial step interface
export interface TutorialStep {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

// Complete a tutorial and receive a reward
export const completeTutorial = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  user: PublicKey,
  tutorialId: number
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(user, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[tutorialService] completeTutorial called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    user: user?.toString(),
    tutorialId,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!user) throw new Error('No user');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[tutorialService] Transaction created');
    
    // Add the complete tutorial instruction
    const ix = await completeTutorialInstruction({
      feePayer: user,
      user,
      tutorialId,
    }, {
      programId,
      connection,
    });
    
    transaction.add(ix);
    console.log('[tutorialService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[tutorialService] Tutorial completed with signature:', signature);
  } catch (error) {
    console.error('[tutorialService] Failed to complete tutorial:', error);
    throw error;
  }
};

// Check if a user has completed a tutorial (read-only, no transaction needed)
export const hasTutorialCompleted = async (
  connection: Connection,
  user: PublicKey,
  tutorialId: number
): Promise<boolean> => {
  console.log('[tutorialService] hasTutorialCompleted called', {
    connection: !!connection,
    user: user?.toString(),
    tutorialId,
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!user) throw new Error('No user');
    
    // This would fetch user profile and check completed tutorials
    // For now, return false
    return false;
  } catch (error) {
    console.error('[tutorialService] Failed to check tutorial completion:', error);
    throw error;
  }
};

// Get all available tutorials (read-only, no transaction needed)
export const getTutorials = async (): Promise<Tutorial[]> => {
  console.log('[tutorialService] getTutorials called');
  
  try {
    // This would typically fetch tutorials from an API or database
    // For now, return a static list of tutorials
    const tutorials: Tutorial[] = [
      {
        id: 1,
        title: 'Welcome to Chumchon',
        description: 'Learn the basics of using Chumchon',
        steps: [
          {
            id: 1,
            title: 'Create Your Profile',
            content: 'Set up your on-chain identity',
          },
          {
            id: 2,
            title: 'Join Your First Group',
            content: 'Connect with other users',
          },
          {
            id: 3,
            title: 'Send Your First Message',
            content: 'Start participating in conversations',
          },
        ],
        rewardAmount: 1000, // 1000 lamports
      },
      {
        id: 2,
        title: 'Advanced Features',
        description: 'Master advanced Chumchon features',
        steps: [
          {
            id: 1,
            title: 'Create a Group',
            content: 'Start your own community',
          },
          {
            id: 2,
            title: 'Use Escrow',
            content: 'Secure token trading',
          },
          {
            id: 3,
            title: 'Participate in Meme Challenges',
            content: 'Create and vote on memes',
          },
        ],
        rewardAmount: 2000, // 2000 lamports
      },
    ];
    
    return tutorials;
  } catch (error) {
    console.error('[tutorialService] Failed to get tutorials:', error);
    throw error;
  }
};

// Get tutorial by ID (read-only, no transaction needed)
export const getTutorialById = async (id: number): Promise<Tutorial | null> => {
  console.log('[tutorialService] getTutorialById called', { id });
  
  try {
    const tutorials = await getTutorials();
    return tutorials.find(tutorial => tutorial.id === id) || null;
  } catch (error) {
    console.error('[tutorialService] Failed to get tutorial by ID:', error);
    throw error;
  }
};