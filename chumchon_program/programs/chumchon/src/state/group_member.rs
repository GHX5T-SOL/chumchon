use anchor_lang::prelude::*;

#[account]
pub struct GroupMember {
    pub group: Pubkey,
    pub member: Pubkey,
    pub joined_at: i64,
    pub bump: u8,
}

impl GroupMember {
    pub const LEN: usize = 8 + // discriminator
        32 * 2 + // Pubkeys
        8 + // i64
        1; // bump
}