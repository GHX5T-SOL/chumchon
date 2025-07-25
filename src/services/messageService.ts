// src/services/messageService.ts
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolana } from '@/contexts/SolanaProvider';
import { getProgramId } from '@/services/programService';
import * as programClient from '@/../chumchon_program/app/program_client';

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
  group: PublicKey,
  sender: PublicKey,
  creator: PublicKey,
  name: string,
  content: string,
  messageId: number
): Promise<Message> => {
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
    
    // Add the send message instruction
    transaction.add(
      await programClient.sendMessage({
        feePayer: sender,
        sender,
        creator,
        name,
        content,
        messageId: BigInt(messageId),
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Message sent with signature:', signature);
    
    // Get the message PDA
    const [messagePda] = programClient.deriveMessageSeedsPDA({
      group,
      messageId: BigInt(messageId),
    }, programId);
    
    // Return the new message
    const now = Date.now();
    return {
      address: messagePda,
      group,
      sender,
      messageId,
      content,
      timestamp: now,
      tipAmount: 0,
    };
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Tip a message
export const tipMessage = async (
  message: PublicKey,
  tipper: PublicKey,
  recipient: PublicKey,
  group: PublicKey,
  messageId: number,
  amount: number
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
    
    // Add the tip message instruction
    transaction.add(
      await programClient.tipMessage({
        feePayer: tipper,
        tipper,
        recipient,
        group,
        messageId: BigInt(messageId),
        amount: BigInt(amount),
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Message tipped with signature:', signature);
  } catch (error) {
    console.error('Failed to tip message:', error);
    throw error;
  }
};

// Get messages for a group
export const getGroupMessages = async (group: PublicKey): Promise<Message[]> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // Query all message accounts for this group
    const messages: Message[] = [];
    
    // This would need to be implemented to fetch all messages for a group
    // For now, we'll return a mock implementation
    const mockMessages = [
      {
        address: new PublicKey('11111111111111111111111111111111'),
        group,
        sender: new PublicKey('22222222222222222222222222222222'),
        messageId: 1,
        content: 'Welcome to the group!',
        timestamp: Date.now() - 3600000, // 1 hour ago
        tipAmount: 0,
      },
      {
        address: new PublicKey('33333333333333333333333333333333'),
        group,
        sender: new PublicKey('44444444444444444444444444444444'),
        messageId: 2,
        content: 'Hey everyone, check out this new NFT collection!',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        tipAmount: 0.1,
      },
    ];
    
    return mockMessages;
  } catch (error) {
    console.error('Failed to get group messages:', error);
    return [];
  }
};

// Get a single message by its address
export const getMessage = async (address: PublicKey): Promise<Message | null> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // Fetch the message account data
    const messageData = await programClient.getMessage(address);
    
    if (!messageData) {
      return null;
    }
    
    // Convert the account data to our Message interface
    return {
      address,
      group: messageData.group,
      sender: messageData.sender,
      messageId: messageData.messageId.toNumber(),
      content: messageData.content,
      timestamp: messageData.timestamp.toNumber(),
      tipAmount: messageData.tipAmount.toNumber(),
    };
  } catch (error) {
    console.error('Failed to get message:', error);
    return null;
  }
};