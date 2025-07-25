// src/services/profileService.ts
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolana } from '@/contexts/SolanaProvider';
import { UserProfile } from '@/contexts/AuthProvider';
import { getProgramId } from '@/services/programService';
import * as anchor from '@coral-xyz/anchor';

// Import the program client
import { createUserProfile as createUserProfileInstruction, getUserProfile as fetchUserProfile } from '../../chumchon_program/app/program_client/rpc';
import { findUserProfilePda } from '../../chumchon_program/app/program_client/pda';

// Initialize the Anchor program client for profile instructions
// REMOVE top-level AnchorProvider.env() and programClient.initializeClient
// console.log('[profileService] Anchor program client initialized', { programId: programId.toString() });

function makeAnchorWallet(publicKey, signAndSendTransaction) {
  return {
    publicKey,
    signTransaction: async (tx) => tx, // MWA signs and sends, so just return tx
    signAllTransactions: async (txs) => txs,
  };
}

// Create a new user profile
export const createUserProfile = async (
  connection,
  signAndSendTransaction,
  owner,
  username,
  bio
) => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  // Initialize the program client with the correct provider
  // programClient.initializeClient(programId, provider); // This line is removed as per the new_code
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
    // Add the create user profile instruction
    const ix = await createUserProfileInstruction({
      owner,
      username,
      bio,
    }, {
      programId,
      connection,
    });
    console.log('[profileService] Instruction created', ix);
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
    console.error('[profileService] Failed to create profile:', error, error?.stack);
    throw error;
  }
};

// Get a user profile
export const getUserProfile = async (owner: PublicKey): Promise<UserProfile | null> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  // Dynamically create provider for Anchor compatibility
  const wallet = makeAnchorWallet(owner, () => { throw new Error('signAndSendTransaction not available'); });
  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  // programClient.initializeClient(programId, provider); // This line is removed as per the new_code
  
  try {
    // Find the PDA for the user profile
    const [profilePda] = findUserProfilePda(owner, programId);
    
    // Fetch the profile data
    const profileData = await fetchUserProfile(
      profilePda,
      { programId, connection }
    );
    
    if (!profileData) {
      return null;
    }
    
    // Convert to our UserProfile type
    return {
      owner: new PublicKey(profileData.owner),
      username: profileData.username,
      bio: profileData.bio,
      profileNft: profileData.profileNft ? new PublicKey(profileData.profileNft) : undefined,
      showBalance: profileData.showBalance,
      reputationScore: profileData.reputationScore,
      joinDate: profileData.joinDate,
      lastActive: profileData.lastActive,
      completedTutorials: Array.from(profileData.completedTutorials),
    };
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
};

// Update a user profile
export const updateUserProfile = async (
  owner: PublicKey,
  updates: {
    username?: string;
    bio?: string;
    showBalance?: boolean;
  }
): Promise<void> => {
  const { connection, signAndSendTransaction } = useSolana();
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  // programClient.initializeClient(programId, provider); // This line is removed as per the new_code
  
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
  owner: PublicKey,
  nftMint: PublicKey,
  nftTokenAccount: PublicKey
): Promise<void> => {
  const { connection, signAndSendTransaction } = useSolana();
  const programId = getProgramId();
  const wallet = makeAnchorWallet(owner, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  // programClient.initializeClient(programId, provider); // This line is removed as per the new_code
  
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