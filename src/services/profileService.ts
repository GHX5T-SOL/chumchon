// src/services/profileService.ts
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolana } from '@/contexts/SolanaProvider';
import { UserProfile } from '@/contexts/AuthProvider';
import { getProgramId } from '@/services/programService';

// Import the program client
import { createUserProfile as createUserProfileInstruction, getUserProfile as fetchUserProfile } from '../../chumchon_program/app/program_client/rpc';
import { findUserProfilePda } from '../../chumchon_program/app/program_client/pda';

// Create a new user profile
export const createUserProfile = async (
  owner: PublicKey,
  username: string,
  bio: string
): Promise<UserProfile> => {
  const { connection, signAndSendTransaction } = useSolana();
  const programId = getProgramId();
  
  try {
    // Create the transaction
    const transaction = new Transaction();
    
    // Add the create user profile instruction
    transaction.add(
      await createUserProfileInstruction({
        owner,
        username,
        bio,
      }, {
        programId,
        connection,
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Profile created with signature:', signature);
    
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
    console.error('Failed to create profile:', error);
    throw error;
  }
};

// Get a user profile
export const getUserProfile = async (owner: PublicKey): Promise<UserProfile | null> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
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
  
  try {
    // Create the transaction
    const transaction = new Transaction();
    
    // Add the update user profile instruction
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
  
  try {
    // Create the transaction
    const transaction = new Transaction();
    
    // Add the set profile NFT instruction
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