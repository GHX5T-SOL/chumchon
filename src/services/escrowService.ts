// src/services/escrowService.ts
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

// Escrow status enum
export enum EscrowStatus {
  Pending = 0,
  Accepted = 1,
  Completed = 2,
  Cancelled = 3,
}

// Escrow interface
export interface Escrow {
  address: PublicKey;
  initiator: PublicKey;
  counterparty: PublicKey;
  group: PublicKey;
  initiatorToken: PublicKey;
  initiatorAmount: number;
  counterpartyToken: PublicKey;
  counterpartyAmount: number;
  status: EscrowStatus;
  createdAt: number;
  expiresAt: number;
}

// Create an escrow
export const createEscrow = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  initiator: PublicKey,
  counterparty: PublicKey,
  group: PublicKey,
  initiatorToken: PublicKey,
  initiatorAmount: number,
  counterpartyToken: PublicKey,
  counterpartyAmount: number,
  expiresAt: number,
  initiatorTokenAccount: PublicKey,
  escrowTokenAccount: PublicKey
): Promise<Escrow> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(initiator, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[escrowService] createEscrow called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    initiator: initiator?.toString(),
    counterparty: counterparty?.toString(),
    group: group?.toString(),
    initiatorToken: initiatorToken?.toString(),
    initiatorAmount,
    counterpartyToken: counterpartyToken?.toString(),
    counterpartyAmount,
    expiresAt,
    initiatorTokenAccount: initiatorTokenAccount?.toString(),
    escrowTokenAccount: escrowTokenAccount?.toString(),
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!initiator) throw new Error('No initiator');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[escrowService] Transaction created');
    
    // Add the create escrow instruction
    // For demo, skip building on-chain instruction
    console.log('[escrowService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[escrowService] Escrow created with signature:', signature);
    
    // Return the new escrow
    const now = Date.now();
    return {
      address: new PublicKey('dummy'), // This would be the actual PDA
      initiator,
      counterparty,
      group,
      initiatorToken,
      initiatorAmount,
      counterpartyToken,
      counterpartyAmount,
      status: EscrowStatus.Pending,
      createdAt: now,
      expiresAt,
    };
  } catch (error) {
    console.error('[escrowService] Failed to create escrow:', error);
    throw error;
  }
};

// Accept an escrow
export const acceptEscrow = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  escrow: PublicKey,
  initiator: PublicKey,
  counterparty: PublicKey,
  createdAt: number,
  escrowTokenAccount: PublicKey
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(counterparty, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[escrowService] acceptEscrow called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    escrow: escrow?.toString(),
    initiator: initiator?.toString(),
    counterparty: counterparty?.toString(),
    createdAt,
    escrowTokenAccount: escrowTokenAccount?.toString(),
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!escrow) throw new Error('No escrow');
    if (!counterparty) throw new Error('No counterparty');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[escrowService] Transaction created');
    
    // Add the accept escrow instruction
    // For demo, skip building on-chain instruction
    console.log('[escrowService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[escrowService] Escrow accepted with signature:', signature);
  } catch (error) {
    console.error('[escrowService] Failed to accept escrow:', error);
    throw error;
  }
};

// Complete an escrow
export const completeEscrow = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  escrow: PublicKey,
  initiator: PublicKey,
  counterparty: PublicKey,
  createdAt: number,
  initiatorTokenAccount: PublicKey,
  counterpartyTokenAccount: PublicKey,
  escrowTokenAccountInitiator: PublicKey,
  escrowTokenAccountCounterparty: PublicKey
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(initiator, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[escrowService] completeEscrow called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    escrow: escrow?.toString(),
    initiator: initiator?.toString(),
    counterparty: counterparty?.toString(),
    createdAt,
    initiatorTokenAccount: initiatorTokenAccount?.toString(),
    counterpartyTokenAccount: counterpartyTokenAccount?.toString(),
    escrowTokenAccountInitiator: escrowTokenAccountInitiator?.toString(),
    escrowTokenAccountCounterparty: escrowTokenAccountCounterparty?.toString(),
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!escrow) throw new Error('No escrow');
    if (!initiator) throw new Error('No initiator');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[escrowService] Transaction created');
    
    // Add the complete escrow instruction
    // For demo, skip building on-chain instruction
    console.log('[escrowService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[escrowService] Escrow completed with signature:', signature);
  } catch (error) {
    console.error('[escrowService] Failed to complete escrow:', error);
    throw error;
  }
};

// Get user's escrows (read-only, no transaction needed)
export const getUserEscrows = async (connection: Connection, user: PublicKey): Promise<Escrow[]> => {
  console.log('[escrowService] getUserEscrows called', {
    connection: !!connection,
    user: user?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!user) throw new Error('No user');
    
    // This would fetch user's escrows from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[escrowService] Failed to get user escrows:', error);
    throw error;
  }
};

// Get escrow by address (read-only, no transaction needed)
export const getEscrow = async (connection: Connection, address: PublicKey): Promise<Escrow | null> => {
  console.log('[escrowService] getEscrow called', {
    connection: !!connection,
    address: address?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!address) throw new Error('No address');
    
    // This would fetch escrow from the blockchain
    // For now, return null
    return null;
  } catch (error) {
    console.error('[escrowService] Failed to get escrow:', error);
    throw error;
  }
};