// src/services/programService.ts
import { Connection, PublicKey, Commitment } from '@solana/web3.js';
import { PROGRAM_ID } from '@/services/programId';

// Environment variables (these will be replaced at build time or loaded from .env in development)
const RPC_URL = 'https://api.devnet.solana.com';
const NETWORK = 'devnet';

/**
 * Get the program ID for the Chumchon program
 * @returns The program ID public key
 */
export const getProgramId = (): PublicKey => {
  return new PublicKey(PROGRAM_ID);
};

/**
 * Get a connection to the Solana network
 * @param commitment The commitment level
 * @returns A Connection object
 */
export const getConnection = (commitment: Commitment = 'confirmed'): Connection => {
  return new Connection(RPC_URL, commitment);
};

/**
 * Get the current network
 * @returns The network name (devnet, testnet, mainnet-beta)
 */
export const getNetwork = (): string => {
  return NETWORK;
};

/**
 * Shorten a Solana address for display
 * @param address The address to shorten
 * @param chars Number of characters to show at start and end
 * @returns Shortened address string
 */
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};
