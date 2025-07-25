// src/services/inviteService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient, createInvite as createInviteInstruction, useInvite as useInviteInstruction } from '../../chumchon_program/app/program_client/rpc';

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

// Invite interface
export interface Invite {
  address: PublicKey;
  group: PublicKey;
  creator: PublicKey;
  code: string;
  maxUses: number;
  uses: number;
  expiresAt: number;
}

// Create a new invite
export const createInvite = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  group: PublicKey,
  creator: PublicKey,
  code: string,
  maxUses: number,
  expiresAt: number
): Promise<Invite> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(creator, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[inviteService] createInvite called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    group: group?.toString(),
    creator: creator?.toString(),
    code,
    maxUses,
    expiresAt,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!group) throw new Error('No group');
    if (!creator) throw new Error('No creator');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[inviteService] Transaction created');
    
    // Add the create invite instruction
    const ix = await createInviteInstruction({
      feePayer: creator,
      code,
      maxUses,
      expiresAt: BigInt(expiresAt),
    }, {
      programId,
      connection,
    });
    
    transaction.add(ix);
    console.log('[inviteService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[inviteService] Invite created with signature:', signature);
    
    // Return the new invite
    return {
      address: new PublicKey('dummy'), // This would be the actual PDA
      group,
      creator,
      code,
      maxUses,
      uses: 0,
      expiresAt,
    };
  } catch (error) {
    console.error('[inviteService] Failed to create invite:', error);
    throw error;
  }
};

// Use an invite to join a group
export const useInvite = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  group: PublicKey,
  member: PublicKey,
  code: string
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(member, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[inviteService] useInvite called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    group: group?.toString(),
    member: member?.toString(),
    code,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!group) throw new Error('No group');
    if (!member) throw new Error('No member');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[inviteService] Transaction created');
    
    // Add the use invite instruction
    const ix = await useInviteInstruction({
      feePayer: member,
      member,
      inviteCode: code,
    }, {
      programId,
      connection,
    });
    
    transaction.add(ix);
    console.log('[inviteService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[inviteService] Invite used with signature:', signature);
  } catch (error) {
    console.error('[inviteService] Failed to use invite:', error);
    throw error;
  }
};

// Get invite by code (read-only, no transaction needed)
export const getInviteByCode = async (connection: Connection, group: PublicKey, code: string): Promise<Invite | null> => {
  console.log('[inviteService] getInviteByCode called', {
    connection: !!connection,
    group: group?.toString(),
    code,
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!group) throw new Error('No group');
    if (!code) throw new Error('No code');
    
    // This would fetch invite from the blockchain
    // For now, return null
    return null;
  } catch (error) {
    console.error('[inviteService] Failed to get invite by code:', error);
    throw error;
  }
};

// Get group invites (read-only, no transaction needed)
export const getGroupInvites = async (connection: Connection, group: PublicKey): Promise<Invite[]> => {
  console.log('[inviteService] getGroupInvites called', {
    connection: !!connection,
    group: group?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!group) throw new Error('No group');
    
    // This would fetch group invites from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[inviteService] Failed to get group invites:', error);
    throw error;
  }
};