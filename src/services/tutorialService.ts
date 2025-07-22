// src/services/tutorialService.ts
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolana } from '../contexts/SolanaProvider';
import { getProgramId } from './programService';
import * as programClient from '../../chumchon_program/app/program_client';

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
  user: PublicKey,
  tutorialId: number,
  rewardAmount: number
): Promise<void> => {
  const { connection, signAndSendTransaction } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
      signTransaction: signAndSendTransaction,
    });
    
    // Create the transaction
    const transaction = new Transaction();
    
    // Add the complete tutorial instruction
    transaction.add(
      await programClient.completeTutorial({
        feePayer: user,
        user,
        tutorialId,
        rewardAmount: BigInt(rewardAmount),
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Tutorial completed with signature:', signature);
  } catch (error) {
    console.error('Failed to complete tutorial:', error);
    throw error;
  }
};

// Check if a user has completed a tutorial
export const hasTutorialCompleted = async (
  user: PublicKey,
  tutorialId: number
): Promise<boolean> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // Get the user profile PDA
    const [profilePda] = programClient.deriveUserProfileSeedsPDA({
      owner: user,
    }, programId);
    
    // Fetch the user profile account data
    const profileData = await programClient.getUserProfile(profilePda);
    
    if (!profileData) {
      return false;
    }
    
    // Check if the tutorial ID is in the completed tutorials array
    return profileData.completedTutorials.includes(tutorialId);
  } catch (error) {
    console.error('Failed to check tutorial completion:', error);
    return false;
  }
};

// Get all available tutorials
export const getTutorials = async (): Promise<Tutorial[]> => {
  // This would typically fetch tutorials from an API or database
  // For now, we'll return a static list of tutorials
  
  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Getting Started with Chumchon',
      description: 'Learn the basics of using the Chumchon app',
      rewardAmount: 100000000, // 0.1 SOL
      steps: [
        {
          id: 1,
          title: 'Create Your Profile',
          content: 'Set up your profile with a username and bio.',
          imageUrl: 'https://example.com/tutorial1-step1.jpg',
        },
        {
          id: 2,
          title: 'Join Your First Group',
          content: 'Find and join a group that interests you.',
          imageUrl: 'https://example.com/tutorial1-step2.jpg',
        },
        {
          id: 3,
          title: 'Send Your First Message',
          content: 'Introduce yourself to the group with a message.',
          imageUrl: 'https://example.com/tutorial1-step3.jpg',
        },
      ],
    },
    {
      id: 2,
      title: 'Creating and Managing Groups',
      description: 'Learn how to create and manage your own groups',
      rewardAmount: 200000000, // 0.2 SOL
      steps: [
        {
          id: 1,
          title: 'Create a Group',
          content: 'Create your own group with a name and description.',
          imageUrl: 'https://example.com/tutorial2-step1.jpg',
        },
        {
          id: 2,
          title: 'Set Group Requirements',
          content: 'Configure token or NFT requirements for your group.',
          imageUrl: 'https://example.com/tutorial2-step2.jpg',
        },
        {
          id: 3,
          title: 'Create and Share Invites',
          content: 'Generate invite codes to share with friends.',
          imageUrl: 'https://example.com/tutorial2-step3.jpg',
        },
      ],
    },
    {
      id: 3,
      title: 'Using the Escrow System',
      description: 'Learn how to safely trade tokens with other users',
      rewardAmount: 300000000, // 0.3 SOL
      steps: [
        {
          id: 1,
          title: 'Create an Escrow',
          content: 'Set up an escrow with the tokens you want to trade.',
          imageUrl: 'https://example.com/tutorial3-step1.jpg',
        },
        {
          id: 2,
          title: 'Accept an Escrow',
          content: 'Learn how to accept an escrow from another user.',
          imageUrl: 'https://example.com/tutorial3-step2.jpg',
        },
        {
          id: 3,
          title: 'Complete an Escrow',
          content: 'Finalize the trade and receive your tokens.',
          imageUrl: 'https://example.com/tutorial3-step3.jpg',
        },
      ],
    },
    {
      id: 4,
      title: 'Participating in Meme Challenges',
      description: 'Learn how to create and participate in meme challenges',
      rewardAmount: 400000000, // 0.4 SOL
      steps: [
        {
          id: 1,
          title: 'Create a Meme Challenge',
          content: 'Set up a new meme challenge with a prompt and reward.',
          imageUrl: 'https://example.com/tutorial4-step1.jpg',
        },
        {
          id: 2,
          title: 'Submit a Meme',
          content: 'Create and submit your meme to a challenge.',
          imageUrl: 'https://example.com/tutorial4-step2.jpg',
        },
        {
          id: 3,
          title: 'Vote for Memes',
          content: 'Vote for your favorite memes in a challenge.',
          imageUrl: 'https://example.com/tutorial4-step3.jpg',
        },
      ],
    },
  ];
  
  return tutorials;
};

// Get a tutorial by ID
export const getTutorialById = async (id: number): Promise<Tutorial | null> => {
  const tutorials = await getTutorials();
  return tutorials.find(tutorial => tutorial.id === id) || null;
};