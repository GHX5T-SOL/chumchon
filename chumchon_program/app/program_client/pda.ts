import {PublicKey} from "@solana/web3.js";
import {BN} from "@coral-xyz/anchor";

export type UserProfileSeedsSeeds = {
    owner: PublicKey, 
};

export const deriveUserProfileSeedsPDA = (
    seeds: UserProfileSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("user"),
            seeds.owner.toBuffer(),
        ],
        programId,
    )
};

export type GroupSeedsSeeds = {
    name: string, 
    creator: PublicKey, 
};

export const deriveGroupSeedsPDA = (
    seeds: GroupSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("group"),
            Buffer.from(seeds.name, "utf8"),
            seeds.creator.toBuffer(),
        ],
        programId,
    )
};

export type GroupMemberSeedsSeeds = {
    group: PublicKey, 
    member: PublicKey, 
};

export const deriveGroupMemberSeedsPDA = (
    seeds: GroupMemberSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("member"),
            seeds.group.toBuffer(),
            seeds.member.toBuffer(),
        ],
        programId,
    )
};

export type MessageSeedsSeeds = {
    group: PublicKey, 
    messageId: bigint, 
};

export const deriveMessageSeedsPDA = (
    seeds: MessageSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("message"),
            seeds.group.toBuffer(),
            Buffer.from(BigUint64Array.from([seeds.messageId]).buffer),
        ],
        programId,
    )
};

export type EscrowSeedsSeeds = {
    initiator: PublicKey, 
    counterparty: PublicKey, 
    createdAt: bigint, 
};

export const deriveEscrowSeedsPDA = (
    seeds: EscrowSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("escrow"),
            seeds.initiator.toBuffer(),
            seeds.counterparty.toBuffer(),
            Buffer.from(BigInt64Array.from([seeds.createdAt]).buffer),
        ],
        programId,
    )
};

export type InviteSeedsSeeds = {
    group: PublicKey, 
    code: string, 
};

export const deriveInviteSeedsPDA = (
    seeds: InviteSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("invite"),
            seeds.group.toBuffer(),
            Buffer.from(seeds.code, "utf8"),
        ],
        programId,
    )
};

export type MemeChallengeSeedsSeeds = {
    creator: PublicKey, 
    startTime: bigint, 
};

export const deriveMemeChallengeSeedsPDA = (
    seeds: MemeChallengeSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("challenge"),
            seeds.creator.toBuffer(),
            Buffer.from(BigInt64Array.from([seeds.startTime]).buffer),
        ],
        programId,
    )
};

export type MemeSubmissionSeedsSeeds = {
    challenge: PublicKey, 
    submitter: PublicKey, 
};

export const deriveMemeSubmissionSeedsPDA = (
    seeds: MemeSubmissionSeedsSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("submission"),
            seeds.challenge.toBuffer(),
            seeds.submitter.toBuffer(),
        ],
        programId,
    )
};

