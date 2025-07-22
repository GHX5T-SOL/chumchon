use anchor_lang::prelude::*;

#[account]
pub struct MemeSubmission {
    pub challenge: Pubkey,
    pub submitter: Pubkey,
    pub image_url: String,   // Assume max 200 chars
    pub title: String,       // Assume max 100 chars
    pub description: String, // Assume max 300 chars
    pub votes: u32,
    pub submitted_at: i64,
    pub bump: u8,
}

impl MemeSubmission {
    pub const LEN: usize = 8 + // discriminator
        32 * 2 + // Pubkeys
        (4 + 200) + // image_url String
        (4 + 100) + // title String
        (4 + 300) + // description String
        4 + // votes u32
        8 + // submitted_at i64
        1; // bump
}