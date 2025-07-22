use anchor_lang::prelude::*;

#[account]
pub struct Message {
    pub group: Pubkey,
    pub sender: Pubkey,
    pub content: String,  // Assume max 500 chars
    pub timestamp: i64,
    pub tips_received: u64,
    pub bump: u8,
}

impl Message {
    pub const LEN: usize = 8 + // discriminator
        32 * 2 + // Pubkeys
        (4 + 500) + // content String
        8 * 2 + // i64 fields
        1; // bump
}