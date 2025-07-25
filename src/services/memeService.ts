// src/services/memeService.ts
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolana } from '@/contexts/SolanaProvider';
import { getProgramId } from '@/services/programService';
import * as programClient from '@/../chumchon_program/app/program_client';

// MemeChallenge interface
export interface MemeChallenge {
  address: PublicKey;
  creator: PublicKey;
  title: string;
  description: string;
  prompt: string;
  rewardAmount: number;
  submissionCount: number;
  startTime: number;
  endTime: number;
  winner?: PublicKey;
}

// MemeSubmission interface
export interface MemeSubmission {
  address: PublicKey;
  challenge: PublicKey;
  submitter: PublicKey;
  imageUrl: string;
  votes: number;
  submittedAt: number;
}

// Create a new meme challenge
export const createMemeChallenge = async (
  creator: PublicKey,
  title: string,
  description: string,
  prompt: string,
  rewardAmount: number,
  startTime: number,
  endTime: number
): Promise<MemeChallenge> => {
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
    
    // Add the create meme challenge instruction
    transaction.add(
      await programClient.createMemeChallenge({
        feePayer: creator,
        creator,
        title,
        description,
        prompt,
        rewardAmount: BigInt(rewardAmount),
        startTime: BigInt(startTime),
        endTime: BigInt(endTime),
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Meme challenge created with signature:', signature);
    
    // Get the challenge PDA
    const [challengePda] = programClient.deriveMemeChallengeSeedsPDA({
      creator,
      startTime: BigInt(startTime),
    }, programId);
    
    // Return the new challenge
    return {
      address: challengePda,
      creator,
      title,
      description,
      prompt,
      rewardAmount,
      submissionCount: 0,
      startTime,
      endTime,
    };
  } catch (error) {
    console.error('Failed to create meme challenge:', error);
    throw error;
  }
};

// Submit a meme to a challenge
export const submitMeme = async (
  challenge: PublicKey,
  submitter: PublicKey,
  creator: PublicKey,
  startTime: number,
  imageUrl: string
): Promise<MemeSubmission> => {
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
    
    // Add the submit meme instruction
    transaction.add(
      await programClient.submitMeme({
        feePayer: submitter,
        submitter,
        creator,
        startTime: BigInt(startTime),
        imageUrl,
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Meme submitted with signature:', signature);
    
    // Get the submission PDA
    const [submissionPda] = programClient.deriveMemeSubmissionSeedsPDA({
      challenge,
      submitter,
    }, programId);
    
    // Return the new submission
    return {
      address: submissionPda,
      challenge,
      submitter,
      imageUrl,
      votes: 0,
      submittedAt: Date.now(),
    };
  } catch (error) {
    console.error('Failed to submit meme:', error);
    throw error;
  }
};

// Vote for a meme
export const voteForMeme = async (
  challenge: PublicKey,
  submitter: PublicKey,
  voter: PublicKey
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
    
    // Add the vote for meme instruction
    transaction.add(
      await programClient.voteForMeme({
        feePayer: voter,
        voter,
        challenge,
        submitter,
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Vote cast with signature:', signature);
  } catch (error) {
    console.error('Failed to vote for meme:', error);
    throw error;
  }
};

// End a meme challenge
export const endMemeChallenge = async (
  creator: PublicKey,
  winner: PublicKey,
  startTime: number
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
    
    // Add the end meme challenge instruction
    transaction.add(
      await programClient.endMemeChallenge({
        feePayer: creator,
        creator,
        winner,
        startTime: BigInt(startTime),
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Meme challenge ended with signature:', signature);
  } catch (error) {
    console.error('Failed to end meme challenge:', error);
    throw error;
  }
};

// Get all meme challenges
export const getMemeChallenges = async (): Promise<MemeChallenge[]> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // This would need to be implemented to fetch all challenges
    // For now, we'll return a mock implementation
    const mockChallenges = [
      {
        address: new PublicKey('11111111111111111111111111111111'),
        creator: new PublicKey('22222222222222222222222222222222'),
        title: 'Solana Meme Contest',
        description: 'Create the funniest Solana-themed meme!',
        prompt: 'Solana speed and scalability',
        rewardAmount: 1000000000, // 1 SOL
        submissionCount: 5,
        startTime: Date.now() - 86400000, // 1 day ago
        endTime: Date.now() + 86400000, // 1 day from now
      },
      {
        address: new PublicKey('33333333333333333333333333333333'),
        creator: new PublicKey('44444444444444444444444444444444'),
        title: 'Crypto Winter Memes',
        description: 'Best memes about surviving the crypto winter',
        prompt: 'Diamond hands in the crypto winter',
        rewardAmount: 500000000, // 0.5 SOL
        submissionCount: 3,
        startTime: Date.now() - 172800000, // 2 days ago
        endTime: Date.now() + 172800000, // 2 days from now
      },
    ];
    
    return mockChallenges;
  } catch (error) {
    console.error('Failed to get meme challenges:', error);
    return [];
  }
};

// Get submissions for a challenge
export const getMemeSubmissions = async (challenge: PublicKey): Promise<MemeSubmission[]> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // This would need to be implemented to fetch all submissions for a challenge
    // For now, we'll return a mock implementation
    const mockSubmissions = [
      {
        address: new PublicKey('55555555555555555555555555555555'),
        challenge,
        submitter: new PublicKey('66666666666666666666666666666666'),
        imageUrl: 'https://example.com/meme1.jpg',
        votes: 10,
        submittedAt: Date.now() - 43200000, // 12 hours ago
      },
      {
        address: new PublicKey('77777777777777777777777777777777'),
        challenge,
        submitter: new PublicKey('88888888888888888888888888888888'),
        imageUrl: 'https://example.com/meme2.jpg',
        votes: 7,
        submittedAt: Date.now() - 21600000, // 6 hours ago
      },
    ];
    
    return mockSubmissions;
  } catch (error) {
    console.error('Failed to get meme submissions:', error);
    return [];
  }
};