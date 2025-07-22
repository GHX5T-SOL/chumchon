use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub initiator: Pubkey,
    pub counterparty: Pubkey,
    pub group: Pubkey,
    pub initiator_token: Pubkey,
    pub initiator_amount: u64,
    pub counterparty_token: Pubkey,
    pub counterparty_amount: u64,
    pub status: u8,
    pub created_at: i64,
    pub expires_at: i64,
    pub accepted: bool,
    pub accepted_at: Option<i64>,
    pub completed: bool,
    pub completed_at: Option<i64>,
    pub bump: u8,
}

impl Escrow {
    pub const LEN: usize = 8 + // discriminator
        32 * 4 + // Pubkeys
        8 * 4 + // u64/i64
        1 * 2 + // bools
        (1 + 8) * 2 + // Options<i64>
        1 + // status u8
        1; // bump u8
}