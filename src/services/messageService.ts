// src/services/messageService.ts
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

// Message interface
export interface Message {
  address: PublicKey;
  group: PublicKey;
  sender: PublicKey;
  messageId: number;
  content: string;
  timestamp: number;
  tipAmount: number;
}

// Send a message to a group
export const sendMessage = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  group: PublicKey,
  sender: PublicKey,
  content: string
): Promise<Message> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(sender, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[messageService] sendMessage called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    group: group?.toString(),
    sender: sender?.toString(),
    content,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!group) throw new Error('No group');
    if (!sender) throw new Error('No sender');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[messageService] Transaction created');
    
    // Add the send message instruction
    // For demo, skip building on-chain instruction
    console.log('[messageService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[messageService] Message sent with signature:', signature);
    
    // Return the new message
    const now = Date.now();
    return {
      address: new PublicKey('dummy'), // This would be the actual PDA
      group,
      sender,
      messageId: 0, // This would be generated
      content,
      timestamp: now,
      tipAmount: 0,
    };
  } catch (error) {
    console.error('[messageService] Failed to send message:', error);
    throw error;
  }
};

// Tip a message
export const tipMessage = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  message: PublicKey,
  tipper: PublicKey,
  recipient: PublicKey,
  group: PublicKey,
  messageId: number,
  amount: number
): Promise<void> => {
  const programId = getProgramId();
  const wallet = makeAnchorWallet(tipper, signAndSendTransaction);
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
  
  // Initialize the Anchor program client
  initializeClient(programId, provider);
  
  console.log('[messageService] tipMessage called', {
    connection: !!connection,
    signAndSendTransaction: !!signAndSendTransaction,
    message: message?.toString(),
    tipper: tipper?.toString(),
    recipient: recipient?.toString(),
    group: group?.toString(),
    messageId,
    amount,
    programId: programId?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!signAndSendTransaction) throw new Error('No signAndSendTransaction');
    if (!message) throw new Error('No message');
    if (!tipper) throw new Error('No tipper');
    if (!recipient) throw new Error('No recipient');
    
    // Create the transaction
    const transaction = new Transaction();
    console.log('[messageService] Transaction created');
    
    // Add the tip message instruction
    // For demo, skip building on-chain instruction
    console.log('[messageService] Instruction added to transaction', transaction);
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('[messageService] Message tipped with signature:', signature);
  } catch (error) {
    console.error('[messageService] Failed to tip message:', error);
    throw error;
  }
};

// Get group messages (read-only, no transaction needed)
export const getGroupMessages = async (connection: Connection, group: PublicKey): Promise<Message[]> => {
  console.log('[messageService] getGroupMessages called', {
    connection: !!connection,
    group: group?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!group) throw new Error('No group');
    
    // This would fetch messages from the blockchain
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('[messageService] Failed to get group messages:', error);
    throw error;
  }
};

// Get message by address (read-only, no transaction needed)
export const getMessage = async (connection: Connection, address: PublicKey): Promise<Message | null> => {
  console.log('[messageService] getMessage called', {
    connection: !!connection,
    address: address?.toString(),
  });
  
  try {
    if (!connection) throw new Error('No Solana connection');
    if (!address) throw new Error('No address');
    
    // This would fetch message from the blockchain
    // For now, return null
    return null;
  } catch (error) {
    console.error('[messageService] Failed to get message:', error);
    throw error;
  }
};