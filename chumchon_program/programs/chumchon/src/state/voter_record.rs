use anchor_lang::prelude::*;

#[account]
pub struct VoterRecord {
    pub submission: Pubkey,
    pub voter: Pubkey,
    pub voted_at: i64,
    pub bump: u8,
}

impl VoterRecord {
    pub const LEN: usize = 8 + // discriminator
        32 * 2 + // Pubkeys
        8 + // voted_at i64
        1; // bump
}