// src/services/groupService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient, createGroup as createGroupInstruction, joinGroup as joinGroupInstruction } from '../../chumchon_program/app/program_client/rpc';

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

// Group interface
export interface Group {
  address: PublicKey;
  name: string;
  description: string;
  creator: PublicKey;
  isChannel: boolean;
  isWhaleGroup: boolean;
  requiredToken?: PublicKey;
  requiredAmount: number;
  requiredNftCollection?: PublicKey;
  requiredSolBalance: number;
  memberCount: number;
  createdAt: number;
  lastMessageAt: number;
}

// Group member interface
export interface GroupMember {
  group: PublicKey;
  member: PublicKey;
  joinedAt: number;
  lastReadMessage: number;
  isAdmin: boolean;
}

// Create a new group
export const createGroup = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  creator: PublicKey,
  name: string,
  description: string,
  isChannel: boolean,
  isWhaleGroup: boolean,
  requiredToken?: PublicKey,
  requiredAmount: number = 0,
  requiredNftCollection?: PublicKey,
  requiredSolBalance: number = 0
): Promise<Group> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(creator, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[groupService] createGroup called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    creator: creator?.toString(),
    name,
    description,
    isChannel,
    isWhaleGroup,
    requiredToken: requiredToken?.toString(),
    requiredAmount,
    requiredNftCollection: requiredNftCollection?.toString(),
    requiredSolBalance,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!creator) throw new Error('No creator');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[groupService] Transaction created');
    
    // Add the create group instruction
    const ix = await createGroupInstruction({
      feePayer: creator,
      creator,
      name,
      description,
      isChannel,
      isWhaleGroup,
      requiredToken,
      requiredAmount: BigInt(requiredAmount),
      requiredNftCollection,
      requiredSolBalance: BigInt(requiredSolBalance),
    }, {
      programId,
      connection,
    });
    
    transaction.add(ix);
    console.log('[groupService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[groupService] Group created with signature:', signature);
    
    // Return the new group
    const now = Date.now();
    return {
      address: new PublicKey('dummy'), // This would be the actual PDA
      name,
      description,
      creator,
      isChannel,
      isWhaleGroup,
      requiredToken,
      requiredAmount,
      requiredNftCollection,
      requiredSolBalance,
      memberCount: 1, // Creator is the first member
      createdAt: now,
      lastMessageAt: now,
    };
  } catch (error) {
    console.error('[groupService] Failed to create group:', error);
    throw error;
  }
};

// Join a group
export const joinGroup = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  group: PublicKey,
  member: PublicKey,
  creator: PublicKey,
  name: string,
  tokenAccount?: PublicKey,
  nftTokenAccount?: PublicKey
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(member, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[groupService] joinGroup called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    group: group?.toString(),
    member: member?.toString(),
    creator: creator?.toString(),
    name,
    tokenAccount: tokenAccount?.toString(),
    nftTokenAccount: nftTokenAccount?.toString(),
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!group) throw new Error('No group');
    if (!member) throw new Error('No member');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[groupService] Transaction created');
    
    // Add the join group instruction
    const ix = await joinGroupInstruction({
      feePayer: member,
      member,
      memberTokenAccount: tokenAccount,
      memberNftAccount: nftTokenAccount,
    }, {
      programId,
      connection,
    });
    
    transaction.add(ix);
    console.log('[groupService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[groupService] Joined group with signature:', signature);
  } catch (error) {
    console.error('[groupService] Failed to join group:', error);
    throw error;
  }
};

// Get all groups (read-only, no transaction needed)
export const getAllGroups = async (connection: Connection): Promise<Group[]> => {
  console.log('[groupService] getAllGroups called', {
    connection: !!connection,
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    
    // This would fetch groups from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[groupService] Failed to get all groups:', error);
    throw error;
  }
};

// Get user's groups (read-only, no transaction needed)
export const getUserGroups = async (connection: Connection, member: PublicKey): Promise<Group[]> => {
  console.log('[groupService] getUserGroups called', {
    connection: !!connection,
    member: member?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!member) throw new Error('No member');
    
    // This would fetch user's groups from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[groupService] Failed to get user groups:', error);
    throw error;
  }
};

// Get group members (read-only, no transaction needed)
export const getGroupMembers = async (connection: Connection, group: PublicKey): Promise<GroupMember[]> => {
  console.log('[groupService] getGroupMembers called', {
    connection: !!connection,
    group: group?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!group) throw new Error('No group');
    
    // This would fetch group members from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[groupService] Failed to get group members:', error);
    throw error;
  }
};