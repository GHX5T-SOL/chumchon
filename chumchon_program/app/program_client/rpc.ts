import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { Chumchon } from "../../target/types/chumchon";
import idl from "../../../src/idl/chumchon.json";
import * as pda from "./pda";

let _program: Program<Chumchon>;

export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider: AnchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<Chumchon>(
        idl as never,
        programId,
        anchorProvider,
    );
};

export type CreateUserProfileArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  username: string;
  bio: string;
  show_balance: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new user profile
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - username: {@link string} 
 * - bio: {@link string} 
 */
export const createUserProfileBuilder = (
	args: CreateUserProfileArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [profilePubkey] = pda.deriveUserProfileSeedsPDA({
        owner: args.owner,
    }, _program.programId);

  return _program
    .methods
    .createUserProfile(
      args.username,
      args.bio,
      args.show_balance,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      profile: profilePubkey,
      owner: args.owner,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new user profile
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - username: {@link string} 
 * - bio: {@link string} 
 */
export const createUserProfile = (
	args: CreateUserProfileArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createUserProfileBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new user profile
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - username: {@link string} 
 * - bio: {@link string} 
 */
export const createUserProfileSendAndConfirm = async (
  args: Omit<CreateUserProfileArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createUserProfileBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type UpdateUserProfileArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  username: string;
  bio: string;
  showBalance: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update an existing user profile
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 *
 * Data:
 * - username: {@link string} 
 * - bio: {@link string} 
 * - show_balance: {@link boolean} 
 */
export const updateUserProfileBuilder = (
	args: UpdateUserProfileArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [profilePubkey] = pda.deriveUserProfileSeedsPDA({
        owner: args.owner,
    }, _program.programId);

  return _program
    .methods
    .updateUserProfile(
      args.username,
      args.bio,
      args.showBalance,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      profile: profilePubkey,
      owner: args.owner,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update an existing user profile
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 *
 * Data:
 * - username: {@link string} 
 * - bio: {@link string} 
 * - show_balance: {@link boolean} 
 */
export const updateUserProfile = (
	args: UpdateUserProfileArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateUserProfileBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update an existing user profile
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 *
 * Data:
 * - username: {@link string} 
 * - bio: {@link string} 
 * - show_balance: {@link boolean} 
 */
export const updateUserProfileSendAndConfirm = async (
  args: Omit<UpdateUserProfileArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateUserProfileBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type SetProfileNftArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  nftTokenAccount: web3.PublicKey;
  nftMint: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Set an NFT as profile picture
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 * 3. `[]` nft_token_account: {@link PublicKey} 
 *
 * Data:
 * - nft_mint: {@link PublicKey} 
 */
export const setProfileNftBuilder = (
	args: SetProfileNftArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [profilePubkey] = pda.deriveUserProfileSeedsPDA({
        owner: args.owner,
    }, _program.programId);

  return _program
    .methods
    .setProfileNft(
      args.nftMint,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      profile: profilePubkey,
      owner: args.owner,
      nftTokenAccount: args.nftTokenAccount,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Set an NFT as profile picture
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 * 3. `[]` nft_token_account: {@link PublicKey} 
 *
 * Data:
 * - nft_mint: {@link PublicKey} 
 */
export const setProfileNft = (
	args: SetProfileNftArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    setProfileNftBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Set an NFT as profile picture
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[signer]` owner: {@link PublicKey} 
 * 3. `[]` nft_token_account: {@link PublicKey} 
 *
 * Data:
 * - nft_mint: {@link PublicKey} 
 */
export const setProfileNftSendAndConfirm = async (
  args: Omit<SetProfileNftArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return setProfileNftBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type CreateGroupArgs = {
  feePayer: web3.PublicKey;
  creator: web3.PublicKey;
  name: string;
  description: string;
  isChannel: boolean;
  isWhaleGroup: boolean;
  requiredToken: web3.PublicKey | undefined;
  requiredAmount: bigint;
  requiredNftCollection: web3.PublicKey | undefined;
  requiredSolBalance: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new group or channel
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - description: {@link string} type
 * - is_channel: {@link boolean} 
 * - is_whale_group: {@link boolean} 
 * - required_token: {@link PublicKey | undefined} 
 * - required_amount: {@link BigInt} 
 * - required_nft_collection: {@link PublicKey | undefined} 
 * - required_sol_balance: {@link BigInt} 
 */
export const createGroupBuilder = (
	args: CreateGroupArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [groupPubkey] = pda.deriveGroupSeedsPDA({
        name: args.name,
        creator: args.creator,
    }, _program.programId);

  return _program
    .methods
    .createGroup(
      args.name,
      args.description,
      args.isChannel,
      args.isWhaleGroup,
      args.requiredToken,
      new BN(args.requiredAmount.toString()),
      args.requiredNftCollection,
      new BN(args.requiredSolBalance.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      group: groupPubkey,
      creator: args.creator,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new group or channel
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - description: {@link string} type
 * - is_channel: {@link boolean} 
 * - is_whale_group: {@link boolean} 
 * - required_token: {@link PublicKey | undefined} 
 * - required_amount: {@link BigInt} 
 * - required_nft_collection: {@link PublicKey | undefined} 
 * - required_sol_balance: {@link BigInt} 
 */
export const createGroup = (
	args: CreateGroupArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createGroupBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new group or channel
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - description: {@link string} type
 * - is_channel: {@link boolean} 
 * - is_whale_group: {@link boolean} 
 * - required_token: {@link PublicKey | undefined} 
 * - required_amount: {@link BigInt} 
 * - required_nft_collection: {@link PublicKey | undefined} 
 * - required_sol_balance: {@link BigInt} 
 */
export const createGroupSendAndConfirm = async (
  args: Omit<CreateGroupArgs, "feePayer" | "creator"> & {
    signers: {
      feePayer: web3.Signer,
      creator: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createGroupBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      creator: args.signers.creator.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.creator])
    .rpc();
}

export type JoinGroupArgs = {
  feePayer: web3.PublicKey;
  member: web3.PublicKey;
  group: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  nftTokenAccount: web3.PublicKey;
  creator: web3.PublicKey;
  name: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Join a group if requirements are met
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[signer]` member: {@link PublicKey} 
 * 3. `[writable]` member_record: {@link GroupMember} 
 * 4. `[]` token_account: {@link PublicKey} 
 * 5. `[]` nft_token_account: {@link PublicKey} 
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 */
export const joinGroupBuilder = (
	args: JoinGroupArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [groupPubkey] = pda.deriveGroupSeedsPDA({
        name: args.name,
        creator: args.creator,
    }, _program.programId);
    const [memberRecordPubkey] = pda.deriveGroupMemberSeedsPDA({
        group: groupPubkey,
        member: args.member,
    }, _program.programId);

  return _program
    .methods
    .joinGroup()
    .accountsStrict({
      feePayer: args.feePayer,
      group: groupPubkey,
      member: args.member,
      memberRecord: memberRecordPubkey,
      memberTokenAccount: args.tokenAccount,
      memberNftAccount: args.nftTokenAccount,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Join a group if requirements are met
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[signer]` member: {@link PublicKey} 
 * 3. `[writable]` member_record: {@link GroupMember} 
 * 4. `[]` token_account: {@link PublicKey} 
 * 5. `[]` nft_token_account: {@link PublicKey} 
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 */
export const joinGroup = (
	args: JoinGroupArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    joinGroupBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Join a group if requirements are met
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[signer]` member: {@link PublicKey} 
 * 3. `[writable]` member_record: {@link GroupMember} 
 * 4. `[]` token_account: {@link PublicKey} 
 * 5. `[]` nft_token_account: {@link PublicKey} 
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 */
export const joinGroupSendAndConfirm = async (
  args: Omit<JoinGroupArgs, "feePayer" | "member"> & {
    signers: {
      feePayer: web3.Signer,
      member: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return joinGroupBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      member: args.signers.member.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.member])
    .rpc();
}

export type SendMessageArgs = {
  feePayer: web3.PublicKey;
  sender: web3.PublicKey;
  group: web3.PublicKey;
  creator: web3.PublicKey;
  name: string;
  content: string;
  messageId: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Send a message to a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[writable]` member_record: {@link GroupMember} 
 * 3. `[writable]` message: {@link Message} 
 * 4. `[signer]` sender: {@link PublicKey} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - content: {@link string} 
 */
export const sendMessageBuilder = (
	args: SendMessageArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [groupPubkey] = pda.deriveGroupSeedsPDA({
        name: args.name,
        creator: args.creator,
    }, _program.programId);
    const [memberRecordPubkey] = pda.deriveGroupMemberSeedsPDA({
        group: groupPubkey,
        member: args.sender,
    }, _program.programId);
    const [messagePubkey] = pda.deriveMessageSeedsPDA({
        group: groupPubkey,
        messageId: args.messageId,
    }, _program.programId);

  return _program
    .methods
    .sendMessage(args.content)
    .accountsStrict({
      feePayer: args.feePayer,
      group: groupPubkey,
      memberRecord: memberRecordPubkey,
      message: messagePubkey,
      sender: args.sender,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Send a message to a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[writable]` member_record: {@link GroupMember} 
 * 3. `[writable]` message: {@link Message} 
 * 4. `[signer]` sender: {@link PublicKey} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - content: {@link string} 
 */
export const sendMessage = (
	args: SendMessageArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    sendMessageBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Send a message to a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` group: {@link Group} 
 * 2. `[writable]` member_record: {@link GroupMember} 
 * 3. `[writable]` message: {@link Message} 
 * 4. `[signer]` sender: {@link PublicKey} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - content: {@link string} 
 */
export const sendMessageSendAndConfirm = async (
  args: Omit<SendMessageArgs, "feePayer" | "sender"> & {
    signers: {
      feePayer: web3.Signer,
      sender: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return sendMessageBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      sender: args.signers.sender.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.sender])
    .rpc();
}

export type TipMessageArgs = {
  feePayer: web3.PublicKey;
  tipper: web3.PublicKey;
  recipient: web3.PublicKey;
  group: web3.PublicKey;
  messageId: bigint;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Tip SOL to a message creator
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` message: {@link Message} 
 * 2. `[writable, signer]` tipper: {@link PublicKey} 
 * 3. `[writable]` recipient: {@link PublicKey} 
 *
 * Data:
 * - group: {@link PublicKey} 
 * - message_id: {@link BigInt} 
 * - amount: {@link BigInt} 
 */
export const tipMessageBuilder = (
	args: TipMessageArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [messagePubkey] = pda.deriveMessageSeedsPDA({
        group: args.group,
        messageId: args.messageId,
    }, _program.programId);

  return _program
    .methods
    .tipMessage(
      args.group,
      new BN(args.messageId.toString()),
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      message: messagePubkey,
      tipper: args.tipper,
      recipient: args.recipient,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Tip SOL to a message creator
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` message: {@link Message} 
 * 2. `[writable, signer]` tipper: {@link PublicKey} 
 * 3. `[writable]` recipient: {@link PublicKey} 
 *
 * Data:
 * - group: {@link PublicKey} 
 * - message_id: {@link BigInt} 
 * - amount: {@link BigInt} 
 */
export const tipMessage = (
	args: TipMessageArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    tipMessageBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Tip SOL to a message creator
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` message: {@link Message} 
 * 2. `[writable, signer]` tipper: {@link PublicKey} 
 * 3. `[writable]` recipient: {@link PublicKey} 
 *
 * Data:
 * - group: {@link PublicKey} 
 * - message_id: {@link BigInt} 
 * - amount: {@link BigInt} 
 */
export const tipMessageSendAndConfirm = async (
  args: Omit<TipMessageArgs, "feePayer" | "tipper"> & {
    signers: {
      feePayer: web3.Signer,
      tipper: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return tipMessageBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      tipper: args.signers.tipper.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.tipper])
    .rpc();
}

export type CreateInviteArgs = {
  feePayer: web3.PublicKey;
  creator: web3.PublicKey;
  group: web3.PublicKey;
  groupCreator: web3.PublicKey;
  name: string;
  code: string;
  maxUses: number;
  expiresAt: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a shareable invite for a group
 */
export const createInviteBuilder = (
	args: CreateInviteArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [invitePubkey] = pda.deriveInviteSeedsPDA({
        group: args.group,
        code: args.code,
    }, _program.programId);
    const [groupPubkey] = pda.deriveGroupSeedsPDA({
        name: args.name,
        creator: args.groupCreator,
    }, _program.programId);

  return _program
    .methods
    .createInvite(
      args.code,
      args.maxUses,
      new BN(args.expiresAt.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      invite: invitePubkey,
      group: groupPubkey,
      creator: args.creator,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a shareable invite for a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` invite: {@link Invite} 
 * 2. `[]` group: {@link Group} 
 * 3. `[signer]` creator: {@link PublicKey} 
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - group_creator: {@link PublicKey} 
 * - name: {@link string} 
 * - code: {@link string} 
 * - max_uses: {@link number} 
 * - expires_at: {@link BigInt} 
 */
export const createInvite = (
	args: CreateInviteArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createInviteBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a shareable invite for a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` invite: {@link Invite} 
 * 2. `[]` group: {@link Group} 
 * 3. `[signer]` creator: {@link PublicKey} 
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - group_creator: {@link PublicKey} 
 * - name: {@link string} 
 * - code: {@link string} 
 * - max_uses: {@link number} 
 * - expires_at: {@link BigInt} 
 */
export const createInviteSendAndConfirm = async (
  args: Omit<CreateInviteArgs, "feePayer" | "creator"> & {
    signers: {
      feePayer: web3.Signer,
      creator: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createInviteBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      creator: args.signers.creator.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.creator])
    .rpc();
}

export type UseInviteArgs = {
  feePayer: web3.PublicKey;
  member: web3.PublicKey;
  group: web3.PublicKey;
  creator: web3.PublicKey;
  name: string;
  code: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Use an invite to join a group
 */
export const useInviteBuilder = (
	args: UseInviteArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [invitePubkey] = pda.deriveInviteSeedsPDA({
        group: args.group,
        code: args.code,
    }, _program.programId);
    const [groupPubkey] = pda.deriveGroupSeedsPDA({
        name: args.name,
        creator: args.creator,
    }, _program.programId);
    const [memberRecordPubkey] = pda.deriveGroupMemberSeedsPDA({
        group: args.group,
        member: args.member,
    }, _program.programId);

  return _program
    .methods
    .useInvite(args.code)
    .accountsStrict({
      feePayer: args.feePayer,
      invite: invitePubkey,
      group: groupPubkey,
      member: args.member,
      memberRecord: memberRecordPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Use an invite to join a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` invite: {@link Invite} 
 * 2. `[writable]` group: {@link Group} 
 * 3. `[signer]` member: {@link PublicKey} 
 * 4. `[writable]` member_record: {@link GroupMember} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - name: {@link string} 
 * - code: {@link string} 
 */
export const useInvite = (
	args: UseInviteArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    useInviteBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Use an invite to join a group
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` invite: {@link Invite} 
 * 2. `[writable]` group: {@link Group} 
 * 3. `[signer]` member: {@link PublicKey} 
 * 4. `[writable]` member_record: {@link GroupMember} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - name: {@link string} 
 * - code: {@link string} 
 */
export const useInviteSendAndConfirm = async (
  args: Omit<UseInviteArgs, "feePayer" | "member"> & {
    signers: {
      feePayer: web3.Signer,
      member: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return useInviteBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      member: args.signers.member.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.member])
    .rpc();
}

export type CreateMemeChallengeArgs = {
  feePayer: web3.PublicKey;
  creator: web3.PublicKey;
  title: string;
  description: string;
  prompt: string;
  rewardAmount: bigint;
  startTime: bigint;
  endTime: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new meme challenge
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - title: {@link string} 
 * - description: {@link string} type
 * - prompt: {@link string} 
 * - reward_amount: {@link BigInt} 
 * - start_time: {@link BigInt} 
 * - end_time: {@link BigInt} 
 */
export const createMemeChallengeBuilder = (
	args: CreateMemeChallengeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [challengePubkey] = pda.deriveMemeChallengeSeedsPDA({
        creator: args.creator,
        startTime: args.startTime,
    }, _program.programId);

  return _program
    .methods
    .createMemeChallenge(
      args.title,
      args.description,
      args.prompt,
      new BN(args.rewardAmount.toString()),
      new BN(args.startTime.toString()),
      new BN(args.endTime.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      challenge: challengePubkey,
      creator: args.creator,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new meme challenge
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - title: {@link string} 
 * - description: {@link string} type
 * - prompt: {@link string} 
 * - reward_amount: {@link BigInt} 
 * - start_time: {@link BigInt} 
 * - end_time: {@link BigInt} 
 */
export const createMemeChallenge = (
	args: CreateMemeChallengeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createMemeChallengeBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new meme challenge
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - title: {@link string} 
 * - description: {@link string} type
 * - prompt: {@link string} 
 * - reward_amount: {@link BigInt} 
 * - start_time: {@link BigInt} 
 * - end_time: {@link BigInt} 
 */
export const createMemeChallengeSendAndConfirm = async (
  args: Omit<CreateMemeChallengeArgs, "feePayer" | "creator"> & {
    signers: {
      feePayer: web3.Signer,
      creator: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createMemeChallengeBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      creator: args.signers.creator.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.creator])
    .rpc();
}

export type SubmitMemeArgs = {
  feePayer: web3.PublicKey;
  submitter: web3.PublicKey;
  challenge: web3.PublicKey;
  creator: web3.PublicKey;
  startTime: bigint;
  imageUrl: string;
  title: string;
  description: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Submit a meme to a challenge
 */
export const submitMemeBuilder = (
	args: SubmitMemeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [challengePubkey] = pda.deriveMemeChallengeSeedsPDA({
        creator: args.creator,
        startTime: args.startTime,
    }, _program.programId);
    const [submissionPubkey] = pda.deriveMemeSubmissionSeedsPDA({
        challenge: args.challenge,
        submitter: args.submitter,
    }, _program.programId);

  return _program
    .methods
    .submitMeme(
      args.imageUrl,
      args.title,
      args.description,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      challenge: challengePubkey,
      submission: submissionPubkey,
      submitter: args.submitter,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Submit a meme to a challenge
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable]` submission: {@link MemeSubmission} 
 * 3. `[signer]` submitter: {@link PublicKey} 
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - start_time: {@link BigInt} 
 * - image_url: {@link string} 
 */
export const submitMeme = (
	args: SubmitMemeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    submitMemeBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Submit a meme to a challenge
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable]` submission: {@link MemeSubmission} 
 * 3. `[signer]` submitter: {@link PublicKey} 
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - start_time: {@link BigInt} 
 * - image_url: {@link string} 
 */
export const submitMemeSendAndConfirm = async (
  args: Omit<SubmitMemeArgs, "feePayer" | "submitter"> & {
    signers: {
      feePayer: web3.Signer,
      submitter: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return submitMemeBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      submitter: args.signers.submitter.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.submitter])
    .rpc();
}

export type VoteForMemeArgs = {
  feePayer: web3.PublicKey;
  voter: web3.PublicKey;
  challenge: web3.PublicKey;
  submitter: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Vote for a meme submission
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` submission: {@link MemeSubmission} 
 * 2. `[signer]` voter: {@link PublicKey} 
 *
 * Data:
 * - challenge: {@link PublicKey} 
 * - submitter: {@link PublicKey} 
 */
export const voteForMemeBuilder = (
	args: VoteForMemeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [submissionPubkey] = pda.deriveMemeSubmissionSeedsPDA({
        challenge: args.challenge,
        submitter: args.submitter,
    }, _program.programId);

  return _program
    .methods
    .voteForMeme(
      args.challenge,
      args.submitter,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      submission: submissionPubkey,
      voter: args.voter,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Vote for a meme submission
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` submission: {@link MemeSubmission} 
 * 2. `[signer]` voter: {@link PublicKey} 
 *
 * Data:
 * - challenge: {@link PublicKey} 
 * - submitter: {@link PublicKey} 
 */
export const voteForMeme = (
	args: VoteForMemeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    voteForMemeBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Vote for a meme submission
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` submission: {@link MemeSubmission} 
 * 2. `[signer]` voter: {@link PublicKey} 
 *
 * Data:
 * - challenge: {@link PublicKey} 
 * - submitter: {@link PublicKey} 
 */
export const voteForMemeSendAndConfirm = async (
  args: Omit<VoteForMemeArgs, "feePayer" | "voter"> & {
    signers: {
      feePayer: web3.Signer,
      voter: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return voteForMemeBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      voter: args.signers.voter.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.voter])
    .rpc();
}

export type EndMemeChallengeArgs = {
  feePayer: web3.PublicKey;
  creator: web3.PublicKey;
  winner: web3.PublicKey;
  startTime: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * End a meme challenge and reward the winner
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[writable]` winner: {@link PublicKey} 
 *
 * Data:
 * - start_time: {@link BigInt} 
 */
export const endMemeChallengeBuilder = (
	args: EndMemeChallengeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [challengePubkey] = pda.deriveMemeChallengeSeedsPDA({
        creator: args.creator,
        startTime: args.startTime,
    }, _program.programId);

  return _program
    .methods
    .endMemeChallenge(
      new BN(args.startTime.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      challenge: challengePubkey,
      creator: args.creator,
      winner: args.winner,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * End a meme challenge and reward the winner
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[writable]` winner: {@link PublicKey} 
 *
 * Data:
 * - start_time: {@link BigInt} 
 */
export const endMemeChallenge = (
	args: EndMemeChallengeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    endMemeChallengeBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * End a meme challenge and reward the winner
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` challenge: {@link MemeChallenge} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[writable]` winner: {@link PublicKey} 
 *
 * Data:
 * - start_time: {@link BigInt} 
 */
export const endMemeChallengeSendAndConfirm = async (
  args: Omit<EndMemeChallengeArgs, "feePayer" | "creator"> & {
    signers: {
      feePayer: web3.Signer,
      creator: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return endMemeChallengeBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      creator: args.signers.creator.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.creator])
    .rpc();
}

export type CompleteTutorialArgs = {
  feePayer: web3.PublicKey;
  user: web3.PublicKey;
  tutorialId: number;
  rewardAmount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Mark a tutorial as completed and reward the user
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[writable, signer]` user: {@link PublicKey} 
 *
 * Data:
 * - tutorial_id: {@link number} 
 * - reward_amount: {@link BigInt} 
 */
export const completeTutorialBuilder = (
	args: CompleteTutorialArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Chumchon, never> => {
    const [profilePubkey] = pda.deriveUserProfileSeedsPDA({
        owner: args.user,
    }, _program.programId);

  return _program
    .methods
    .completeTutorial(
      args.tutorialId,
      new BN(args.rewardAmount.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      profile: profilePubkey,
      user: args.user,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Mark a tutorial as completed and reward the user
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[writable, signer]` user: {@link PublicKey} 
 *
 * Data:
 * - tutorial_id: {@link number} 
 * - reward_amount: {@link BigInt} 
 */
export const completeTutorial = (
	args: CompleteTutorialArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    completeTutorialBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Mark a tutorial as completed and reward the user
 *
 * Accounts:
 * 0. `[signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` profile: {@link UserProfile} 
 * 2. `[writable, signer]` user: {@link PublicKey} 
 *
 * Data:
 * - tutorial_id: {@link number} 
 * - reward_amount: {@link BigInt} 
 */
export const completeTutorialSendAndConfirm = async (
  args: Omit<CompleteTutorialArgs, "feePayer" | "user"> & {
    signers: {
      feePayer: web3.Signer,
      user: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return completeTutorialBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      user: args.signers.user.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.user])
    .rpc();
}

// Getters

export const getUserProfile = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["userProfile"]> => _program.account.userProfile.fetch(publicKey, commitment);

export const getUserProfileNullable = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["userProfile"] | null> => _program.account.userProfile.fetchNullable(publicKey, commitment);

export const getGroup = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["group"]> => _program.account.group.fetch(publicKey, commitment);

export const getGroupMember = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["groupMember"]> => _program.account.groupMember.fetch(publicKey, commitment);

export const getMessage = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["message"]> => _program.account.message.fetch(publicKey, commitment);

export const getEscrow = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["escrow"]> => _program.account.escrow.fetch(publicKey, commitment);

export const getInvite = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["invite"]> => _program.account.invite.fetch(publicKey, commitment);

export const getMemeChallenge = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["memeChallenge"]> => _program.account.memeChallenge.fetch(publicKey, commitment);

export const getMemeSubmission = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Chumchon>["memeSubmission"]> => _program.account.memeSubmission.fetch(publicKey, commitment);
