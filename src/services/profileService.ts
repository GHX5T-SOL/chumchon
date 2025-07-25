// src/services/profileService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient, createUserProfile as createUserProfileInstruction, getUserProfile as fetchUserProfile } from '../../chumchon_program/app/program_client/rpc';

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

// Create a new user profile
export const createUserProfile = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  owner: PublicKey,
  username: string,
  bio: string
) => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Always initialize the Anchor program client before building the instruction
  initializeClient(programId, provider);
  
  console.log('[profileService] createUserProfile called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    owner: owner?.toString(),
    username,
    bio,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!owner) throw new Error('No owner');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[profileService] Transaction created');
    
    // Add the create user profile instruction, explicitly passing show_balance: false
    const ix = await createUserProfileInstruction({
      feePayer: owner,
      owner,
      username,
      bio,
      showBalance: false,
    }, {
      programId,
      connection,
    });
    
    transaction.add(ix);
    console.log('[profileService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[profileService] Profile created with signature:', signature);
    
    // Return the new profile
    const now = Date.now();
    return {
      owner,
      username,
      bio,
      showBalance: false,
      reputationScore: 0,
      joinDate: now,
      lastActive: now,
      completedTutorials: [],
    };
  } catch (error) {
    console.error('[profileService] Failed to create profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (
  connection: Connection,
  owner: PublicKey
) => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, () => Promise.resolve(''));
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Always initialize the Anchor program client before building the instruction
  initializeClient(programId, provider);
  
  console.log('[profileService] getUserProfile called', {
    connection: !!connection,
    owner: owner?.toString(),
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!owner) throw new Error('No owner');
    
    const profile = await fetchUserProfile({
      owner,
    }, {
      programId,
      connection,
    });
    
    console.log('[profileService] Profile fetched:', profile);
    
    // Transform the profile data to match the expected format
    return {
      owner: profile.owner,
      username: profile.username,
      bio: profile.bio,
      showBalance: profile.showBalance,
      reputationScore: profile.reputationScore?.toNumber() || 0,
      joinDate: profile.joinDate?.toNumber() || Date.now(),
      lastActive: profile.lastActive?.toNumber() || Date.now(),
      completedTutorials: profile.completedTutorials || [],
    };
  } catch (error) {
    console.error('[profileService] Failed to get profile:', error);
    throw error;
  }
};

// Update a user profile
export const updateUserProfile = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  owner: PublicKey,
  updates: {
    username?: string;
    bio?: string;
    showBalance?: boolean;
  }
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  try {
    // Create the transaction
    const transaction = new Transaction();
    
    // Add the update user profile instruction (to be implemented)
    // This would need to be implemented in your program client
    // transaction.add(
    //   await updateUserProfileInstruction({
    //     owner,
    //     ...updates,
    //   }, {
    //     programId,
    //     connection,
    //   })
    // );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Profile updated with signature:', signature);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};

// Set profile NFT
export const setProfileNft = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  owner: PublicKey,
  nftMint: PublicKey,
  nftTokenAccount: PublicKey
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  try {
    // Create the transaction
    const transaction = new Transaction();
    
    // Add the set profile NFT instruction (to be implemented)
    // This would need to be implemented in your program client
    // transaction.add(
    //   await setProfileNftInstruction({
    //     owner,
    //     nftMint,
    //     nftTokenAccount,
    //   }, {
    //     programId,
    //     connection,
    //   })
    // );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Profile NFT set with signature:', signature);
  } catch (error) {
    console.error('Failed to set profile NFT:', error);
    throw error;
  }
};