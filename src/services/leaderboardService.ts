// src/services/leaderboardService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { initializeClient } from '../../chumchon_program/app/program_client/rpc';

// Program ID from Anchor.toml
const PROGRAM_ID = new PublicKey('CVjwSHMQ9YTenzKwQczwXWzJFk5kwaUhKDtxDKVazJXj');

// Trader interface
export interface Trader {
  id: string;
  username: string;
  address: string;
  avatar: string;
  dailyPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  totalPnl: number;
  winRate: number;
  tradesCount: number;
  followers: number;
  isTracked: boolean;
  isCopied: boolean;
  rank: number;
  tags: string[];
  lastTradeAt: number;
  totalVolume: number;
  averageTradeSize: number;
}

// Tracking interface
export interface TraderTracking {
  traderAddress: string;
  followerAddress: string;
  copyAmount?: number;
  isActive: boolean;
  createdAt: number;
}

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

// Fetch top traders from blockchain
export const getTopTraders = async (
  connection: Connection,
  timeFrame: 'daily' | 'weekly' | 'monthly' = 'daily',
  limit: number = 50
): Promise<Trader[]> => {
  try {
    // In a real implementation, this would query the blockchain for trader data
    // For now, we'll return mock data that simulates on-chain data
    
    console.log('[leaderboardService] Fetching top traders from blockchain...');
    
    // Simulate blockchain query delay
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    // Mock data that would come from blockchain
    const mockTraders: Trader[] = [
      {
        id: '1',
        username: 'CryptoWhale_420',
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto1',
        dailyPnl: 15420.50,
        weeklyPnl: 89230.75,
        monthlyPnl: 324500.25,
        totalPnl: 1250000.00,
        winRate: 87.5,
        tradesCount: 156,
        followers: 2847,
        isTracked: false,
        isCopied: false,
        rank: 1,
        tags: ['DeFi', 'Yield Farming', 'Leverage'],
        lastTradeAt: Date.now() - 300000, // 5 minutes ago
        totalVolume: 2500000,
        averageTradeSize: 16025.64,
      },
      {
        id: '2',
        username: 'SolanaSniper',
        address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto2',
        dailyPnl: 12350.25,
        weeklyPnl: 65420.50,
        monthlyPnl: 289400.75,
        totalPnl: 980000.00,
        winRate: 82.3,
        tradesCount: 203,
        followers: 2156,
        isTracked: true,
        isCopied: false,
        rank: 2,
        tags: ['NFTs', 'Meme Coins', 'Arbitrage'],
        lastTradeAt: Date.now() - 600000, // 10 minutes ago
        totalVolume: 1800000,
        averageTradeSize: 8866.99,
      },
      {
        id: '3',
        username: 'DeFi_Degenerate',
        address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto3',
        dailyPnl: 9875.75,
        weeklyPnl: 45680.25,
        monthlyPnl: 198750.50,
        totalPnl: 750000.00,
        winRate: 79.8,
        tradesCount: 178,
        followers: 1892,
        isTracked: false,
        isCopied: true,
        rank: 3,
        tags: ['Options', 'Futures', 'High Risk'],
        lastTradeAt: Date.now() - 900000, // 15 minutes ago
        totalVolume: 1500000,
        averageTradeSize: 8426.97,
      },
      {
        id: '4',
        username: 'NFT_Hunter',
        address: '3xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto4',
        dailyPnl: 8765.50,
        weeklyPnl: 38950.75,
        monthlyPnl: 165420.25,
        totalPnl: 620000.00,
        winRate: 85.2,
        tradesCount: 134,
        followers: 1654,
        isTracked: false,
        isCopied: false,
        rank: 4,
        tags: ['NFTs', 'Art', 'Collectibles'],
        lastTradeAt: Date.now() - 1200000, // 20 minutes ago
        totalVolume: 1200000,
        averageTradeSize: 8955.22,
      },
      {
        id: '5',
        username: 'Yield_Farmer_Pro',
        address: '2xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto5',
        dailyPnl: 7654.25,
        weeklyPnl: 32450.50,
        monthlyPnl: 142800.75,
        totalPnl: 520000.00,
        winRate: 91.7,
        tradesCount: 89,
        followers: 1423,
        isTracked: true,
        isCopied: false,
        rank: 5,
        tags: ['Yield Farming', 'Staking', 'Conservative'],
        lastTradeAt: Date.now() - 1800000, // 30 minutes ago
        totalVolume: 1000000,
        averageTradeSize: 11235.96,
      },
    ];
    
    // Sort by the selected time frame
    const sortedTraders = mockTraders.sort((a, b) => {
      const aPnl = timeFrame === 'daily' ? a.dailyPnl : 
                    timeFrame === 'weekly' ? a.weeklyPnl : a.monthlyPnl;
      const bPnl = timeFrame === 'daily' ? b.dailyPnl : 
                    timeFrame === 'weekly' ? b.weeklyPnl : b.monthlyPnl;
      return bPnl - aPnl;
    });
    
    return sortedTraders.slice(0, limit);
  } catch (error) {
    console.error('[leaderboardService] Failed to fetch top traders:', error);
    throw new Error('Failed to fetch top traders from blockchain');
  }
};

// Track a trader (follow for notifications)
export const trackTrader = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  follower: PublicKey,
  traderAddress: string
): Promise<void> => {
  try {
    const programId = getProgramId();
    const wallet = makeAnchorWallet(follower, signAndSendTransaction);
    const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
    
    // Initialize the Anchor program client
    initializeClient(programId, provider);
    
    console.log('[leaderboardService] Tracking trader:', {
      follower: follower.toString(),
      traderAddress,
      programId: programId.toString(),
    });
    
    // In a real implementation, this would create a tracking instruction
    // For now, we'll simulate the transaction
    const transaction = new Transaction();
    
    // Add tracking instruction here when implemented in the program
    // const ix = await trackTraderInstruction({
    //   follower,
    //   traderAddress: new PublicKey(traderAddress),
    // });
    // transaction.add(ix);
    
    // For now, just simulate the transaction
    await signAndSendTransaction(transaction);
    
    console.log('[leaderboardService] Trader tracked successfully');
  } catch (error) {
    console.error('[leaderboardService] Failed to track trader:', error);
    throw new Error('Failed to track trader');
  }
};

// Copy a trader's strategy
export const copyTrader = async (
  connection: Connection,
  signAndSendTransaction: (tx: Transaction) => Promise<string>,
  follower: PublicKey,
  traderAddress: string,
  copyAmount: number
): Promise<void> => {
  try {
    const programId = getProgramId();
    const wallet = makeAnchorWallet(follower, signAndSendTransaction);
    const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'confirmed' });
    
    // Initialize the Anchor program client
    initializeClient(programId, provider);
    
    console.log('[leaderboardService] Copying trader:', {
      follower: follower.toString(),
      traderAddress,
      copyAmount,
      programId: programId.toString(),
    });
    
    // In a real implementation, this would create a copy trader instruction
    // For now, we'll simulate the transaction
    const transaction = new Transaction();
    
    // Add copy trader instruction here when implemented in the program
    // const ix = await copyTraderInstruction({
    //   follower,
    //   traderAddress: new PublicKey(traderAddress),
    //   copyAmount: new BN(copyAmount * 1e9), // Convert to lamports
    // });
    // transaction.add(ix);
    
    // For now, just simulate the transaction
    await signAndSendTransaction(transaction);
    
    console.log('[leaderboardService] Trader copied successfully');
  } catch (error) {
    console.error('[leaderboardService] Failed to copy trader:', error);
    throw new Error('Failed to copy trader');
  }
};

// Get trader details
export const getTraderDetails = async (
  connection: Connection,
  traderAddress: string
): Promise<Trader | null> => {
  try {
    console.log('[leaderboardService] Fetching trader details:', traderAddress);
    
    // In a real implementation, this would query the blockchain for specific trader data
    // For now, we'll return mock data
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    // Mock trader details
    const mockTrader: Trader = {
      id: '1',
      username: 'CryptoWhale_420',
      address: traderAddress,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto1',
      dailyPnl: 15420.50,
      weeklyPnl: 89230.75,
      monthlyPnl: 324500.25,
      totalPnl: 1250000.00,
      winRate: 87.5,
      tradesCount: 156,
      followers: 2847,
      isTracked: false,
      isCopied: false,
      rank: 1,
      tags: ['DeFi', 'Yield Farming', 'Leverage'],
      lastTradeAt: Date.now() - 300000,
      totalVolume: 2500000,
      averageTradeSize: 16025.64,
    };
    
    return mockTrader;
  } catch (error) {
    console.error('[leaderboardService] Failed to fetch trader details:', error);
    return null;
  }
};

// Get user's tracked traders
export const getTrackedTraders = async (
  connection: Connection,
  userAddress: string
): Promise<Trader[]> => {
  try {
    console.log('[leaderboardService] Fetching tracked traders for user:', userAddress);
    
    // In a real implementation, this would query the blockchain for user's tracked traders
    // For now, we'll return mock data
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    // Mock tracked traders
    const mockTrackedTraders: Trader[] = [
      {
        id: '2',
        username: 'SolanaSniper',
        address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto2',
        dailyPnl: 12350.25,
        weeklyPnl: 65420.50,
        monthlyPnl: 289400.75,
        totalPnl: 980000.00,
        winRate: 82.3,
        tradesCount: 203,
        followers: 2156,
        isTracked: true,
        isCopied: false,
        rank: 2,
        tags: ['NFTs', 'Meme Coins', 'Arbitrage'],
        lastTradeAt: Date.now() - 600000,
        totalVolume: 1800000,
        averageTradeSize: 8866.99,
      },
      {
        id: '5',
        username: 'Yield_Farmer_Pro',
        address: '2xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto5',
        dailyPnl: 7654.25,
        weeklyPnl: 32450.50,
        monthlyPnl: 142800.75,
        totalPnl: 520000.00,
        winRate: 91.7,
        tradesCount: 89,
        followers: 1423,
        isTracked: true,
        isCopied: false,
        rank: 5,
        tags: ['Yield Farming', 'Staking', 'Conservative'],
        lastTradeAt: Date.now() - 1800000,
        totalVolume: 1000000,
        averageTradeSize: 11235.96,
      },
    ];
    
    return mockTrackedTraders;
  } catch (error) {
    console.error('[leaderboardService] Failed to fetch tracked traders:', error);
    return [];
  }
};

// Get user's copied traders
export const getCopiedTraders = async (
  connection: Connection,
  userAddress: string
): Promise<Trader[]> => {
  try {
    console.log('[leaderboardService] Fetching copied traders for user:', userAddress);
    
    // In a real implementation, this would query the blockchain for user's copied traders
    // For now, we'll return mock data
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    // Mock copied traders
    const mockCopiedTraders: Trader[] = [
      {
        id: '3',
        username: 'DeFi_Degenerate',
        address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto3',
        dailyPnl: 9875.75,
        weeklyPnl: 45680.25,
        monthlyPnl: 198750.50,
        totalPnl: 750000.00,
        winRate: 79.8,
        tradesCount: 178,
        followers: 1892,
        isTracked: false,
        isCopied: true,
        rank: 3,
        tags: ['Options', 'Futures', 'High Risk'],
        lastTradeAt: Date.now() - 900000,
        totalVolume: 1500000,
        averageTradeSize: 8426.97,
      },
      {
        id: '7',
        username: 'Arbitrage_Master',
        address: '8xNweLHLqrxmofu1c8tVeca6XqaDwX7XAkYieSzK6R6v',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto7',
        dailyPnl: 5432.50,
        weeklyPnl: 25480.75,
        monthlyPnl: 112300.25,
        totalPnl: 420000.00,
        winRate: 88.9,
        tradesCount: 445,
        followers: 2234,
        isTracked: false,
        isCopied: true,
        rank: 7,
        tags: ['Arbitrage', 'DEX', 'Low Risk'],
        lastTradeAt: Date.now() - 1500000,
        totalVolume: 800000,
        averageTradeSize: 1797.75,
      },
    ];
    
    return mockCopiedTraders;
  } catch (error) {
    console.error('[leaderboardService] Failed to fetch copied traders:', error);
    return [];
  }
}; 