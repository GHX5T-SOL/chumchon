use anchor_lang::prelude::*;

#[account]
pub struct Invite {
    pub group: Pubkey,
    pub creator: Pubkey,
    pub code: String,  // Assume max 32 chars
    pub max_uses: u32,
    pub uses: u32,
    pub expires_at: i64,
    pub bump: u8,
}

impl Invite {
    pub const LEN: usize = 8 + // discriminator
        32 * 2 + // Pubkeys
        (4 + 32) + // code String
        4 * 2 + // u32
        8 + // i64
        1; // bump
}