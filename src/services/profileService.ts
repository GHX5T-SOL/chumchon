// src/services/profileService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient, createUserProfile as createUserProfileInstruction, getUserProfileNullable } from '../../chumchon_program/app/program_client/rpc';
import { Buffer } from 'buffer';

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
    
    console.log('[profileService] All parameters validated, creating transaction...');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[profileService] Transaction created');
    
    // Add the create user profile instruction, explicitly passing show_balance: false
    console.log('[profileService] Building instruction with params:', {
      feePayer: owner.toString(),
      owner: owner.toString(),
      username,
      bio,
      show_balance: false
    });
    
    let ix;
    try {
      ix = await createUserProfileInstruction({
        feePayer: owner,
        owner,
        username,
        bio,
        show_balance: false
      });
      console.log('[profileService] Instruction built successfully:', ix);
    } catch (instructionError: any) {
      console.error('[profileService] Failed to build instruction:', instructionError);
      throw new Error(`Failed to build createUserProfile instruction: ${instructionError.message}`);
    }
    
    transaction.add(ix);
    console.log('[profileService] Instruction added to transaction, transaction size:', transaction.instructions.length);
    
    // Sign and send the transaction
    console.log('[profileService] About to sign and send transaction...');
    const signature = await signAndSendTransaction(transaction);
    console.log('[profileService] Profile created with signature:', signature);
    
    // Return the new profile
    const now = Date.now();
    const newProfile = {
      owner,
      username,
      bio,
      showBalance: false,
      reputationScore: 0,
      joinDate: now,
      lastActive: now,
      completedTutorials: [],
    };
    
    console.log('[profileService] Returning new profile:', newProfile);
    return newProfile;
  } catch (error: any) {
    console.error('[profileService] Failed to create profile:', error);
    console.error('[profileService] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
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
    
    // Derive the PDA for the user profile
    const [profilePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        owner.toBuffer(),
      ],
      programId
    );
    
    console.log('[profileService] Derived profile PDA:', profilePda.toString());
    
    // Use fetchNullable to handle non-existent accounts gracefully
    let profile;
    try {
      profile = await getUserProfileNullable(profilePda);
      if (profile === null) {
        console.log('[profileService] No profile found, returning null');
        return null;
      }
      console.log('[profileService] Profile fetched:', profile);
    } catch (fetchError: any) {
      console.error('[profileService] Fetch error:', fetchError);
      if (fetchError.message && fetchError.message.includes('Account does not exist')) {
        console.log('[profileService] Account does not exist, returning null');
        return null;
      }
      throw fetchError;
    }
    
    // Transform the profile data to match the expected format
    return {
      owner: profile.owner,
      username: profile.username,
      bio: profile.bio,
      showBalance: profile.showBalance,
      reputationScore: profile.tutorialRewards?.toNumber() || 0,
      joinDate: profile.createdAt?.toNumber() || Date.now(),
      lastActive: profile.lastActive?.toNumber() || Date.now(),
      completedTutorials: profile.completedTutorials || [],
    };
  } catch (error: any) {
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