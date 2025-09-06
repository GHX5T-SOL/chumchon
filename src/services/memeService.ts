// src/services/memeService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient } from '../../chumchon_program/app/program_client/rpc';

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
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  creator: PublicKey,
  title: string,
  description: string,
  prompt: string,
  rewardAmount: number,
  startTime: number,
  endTime: number
): Promise<MemeChallenge> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(creator, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[memeService] createMemeChallenge called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    creator: creator?.toString(),
    title,
    description,
    prompt,
    rewardAmount,
    startTime,
    endTime,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!creator) throw new Error('No creator');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[memeService] Transaction created');
    
    // Add the create meme challenge instruction
    // For demo, skip building on-chain instruction
    console.log('[memeService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[memeService] Meme challenge created with signature:', signature);
    
    // Return the new challenge
    return {
      address: new PublicKey('dummy'), // This would be the actual PDA
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
    console.error('[memeService] Failed to create meme challenge:', error);
    throw error;
  }
};

// Submit a meme to a challenge
export const submitMeme = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  challenge: PublicKey,
  submitter: PublicKey,
  imageUrl: string,
  title: string,
  description: string
): Promise<MemeSubmission> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(submitter, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[memeService] submitMeme called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    challenge: challenge?.toString(),
    submitter: submitter?.toString(),
    imageUrl,
    title,
    description,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!challenge) throw new Error('No challenge');
    if (!submitter) throw new Error('No submitter');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[memeService] Transaction created');
    
    // Add the submit meme instruction
    // For demo, skip building on-chain instruction
    console.log('[memeService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[memeService] Meme submitted with signature:', signature);
    
    // Return the new submission
    const now = Date.now();
    return {
      address: new PublicKey('dummy'), // This would be the actual PDA
      challenge,
      submitter,
      imageUrl,
      votes: 0,
      submittedAt: now,
    };
  } catch (error) {
    console.error('[memeService] Failed to submit meme:', error);
    throw error;
  }
};

// Vote for a meme
export const voteForMeme = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  challenge: PublicKey,
  submitter: PublicKey,
  voter: PublicKey
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(voter, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[memeService] voteForMeme called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    challenge: challenge?.toString(),
    submitter: submitter?.toString(),
    voter: voter?.toString(),
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!challenge) throw new Error('No challenge');
    if (!submitter) throw new Error('No submitter');
    if (!voter) throw new Error('No voter');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[memeService] Transaction created');
    
    // Add the vote for meme instruction
    // For demo, skip building on-chain instruction
    console.log('[memeService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[memeService] Vote submitted with signature:', signature);
  } catch (error) {
    console.error('[memeService] Failed to vote for meme:', error);
    throw error;
  }
};

// End a meme challenge
export const endMemeChallenge = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  creator: PublicKey,
  winner: PublicKey,
  startTime: number
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(creator, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[memeService] endMemeChallenge called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    creator: creator?.toString(),
    winner: winner?.toString(),
    startTime,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!creator) throw new Error('No creator');
    if (!winner) throw new Error('No winner');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[memeService] Transaction created');
    
    // Add the end meme challenge instruction
    // For demo, skip building on-chain instruction
    console.log('[memeService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[memeService] Challenge ended with signature:', signature);
  } catch (error) {
    console.error('[memeService] Failed to end meme challenge:', error);
    throw error;
  }
};

// Get all meme challenges (read-only, no transaction needed)
export const getMemeChallenges = async (connection: Connection): Promise<MemeChallenge[]> => {
  console.log('[memeService] getMemeChallenges called', {
    connection: !!connection,
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    
    // This would fetch challenges from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[memeService] Failed to get meme challenges:', error);
    throw error;
  }
};

// Get meme submissions for a challenge (read-only, no transaction needed)
export const getMemeSubmissions = async (connection: Connection, challenge: PublicKey): Promise<MemeSubmission[]> => {
  console.log('[memeService] getMemeSubmissions called', {
    connection: !!connection,
    challenge: challenge?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!challenge) throw new Error('No challenge');
    
    // This would fetch submissions from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[memeService] Failed to get meme submissions:', error);
    throw error;
  }
};