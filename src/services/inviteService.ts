// src/services/inviteService.ts
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolana } from '@/contexts/SolanaProvider';
import { getProgramId } from '@/services/programService';
import * as programClient from '@/../chumchon_program/app/program_client';

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
  group: PublicKey,
  creator: PublicKey,
  groupCreator: PublicKey,
  name: string,
  code: string,
  maxUses: number,
  expiresAt: number
): Promise<Invite> => {
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
    
    // Add the create invite instruction
    transaction.add(
      await programClient.createInvite({
        feePayer: creator,
        creator,
        groupCreator,
        name,
        code,
        maxUses,
        expiresAt: BigInt(expiresAt),
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Invite created with signature:', signature);
    
    // Get the invite PDA
    const [invitePda] = programClient.deriveInviteSeedsPDA({
      group,
      code,
    }, programId);
    
    // Return the new invite
    return {
      address: invitePda,
      group,
      creator,
      code,
      maxUses,
      uses: 0,
      expiresAt,
    };
  } catch (error) {
    console.error('Failed to create invite:', error);
    throw error;
  }
};

// Use an invite to join a group
export const useInvite = async (
  group: PublicKey,
  member: PublicKey,
  creator: PublicKey,
  name: string,
  code: string
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
    
    // Add the use invite instruction
    transaction.add(
      await programClient.useInvite({
        feePayer: member,
        member,
        creator,
        name,
        code,
      })
    );
    
    // Sign and send the transaction
    const signature = await signAndSendTransaction(transaction);
    console.log('Invite used with signature:', signature);
  } catch (error) {
    console.error('Failed to use invite:', error);
    throw error;
  }
};

// Get an invite by code
export const getInviteByCode = async (group: PublicKey, code: string): Promise<Invite | null> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // Get the invite PDA
    const [invitePda] = programClient.deriveInviteSeedsPDA({
      group,
      code,
    }, programId);
    
    // Fetch the invite account data
    const inviteData = await programClient.getInvite(invitePda);
    
    if (!inviteData) {
      return null;
    }
    
    // Convert the account data to our Invite interface
    return {
      address: invitePda,
      group: inviteData.group,
      creator: inviteData.creator,
      code: inviteData.code,
      maxUses: inviteData.maxUses,
      uses: inviteData.uses,
      expiresAt: inviteData.expiresAt.toNumber(),
    };
  } catch (error) {
    console.error('Failed to get invite:', error);
    return null;
  }
};

// Get all invites for a group
export const getGroupInvites = async (group: PublicKey): Promise<Invite[]> => {
  const { connection } = useSolana();
  const programId = getProgramId();
  
  try {
    // Initialize the program client
    programClient.initializeClient(programId, {
      connection,
    });
    
    // This would need to be implemented to fetch all invites for a group
    // For now, we'll return a mock implementation
    const mockInvites = [
      {
        address: new PublicKey('11111111111111111111111111111111'),
        group,
        creator: new PublicKey('22222222222222222222222222222222'),
        code: 'ABC123',
        maxUses: 10,
        uses: 3,
        expiresAt: Date.now() + 604800000, // 1 week from now
      },
      {
        address: new PublicKey('33333333333333333333333333333333'),
        group,
        creator: new PublicKey('44444444444444444444444444444444'),
        code: 'XYZ789',
        maxUses: 5,
        uses: 1,
        expiresAt: Date.now() + 259200000, // 3 days from now
      },
    ];
    
    return mockInvites;
  } catch (error) {
    console.error('Failed to get group invites:', error);
    return [];
  }
};