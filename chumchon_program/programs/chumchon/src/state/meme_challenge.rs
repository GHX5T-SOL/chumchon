use anchor_lang::prelude::*;

#[account]
pub struct MemeChallenge {
    pub creator: Pubkey,
    pub title: String,      // Assume max 100 chars
    pub description: String, // Assume max 500 chars
    pub prompt: String,     // Assume max 300 chars
    pub reward_amount: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub submission_count: u32,
    pub total_votes: u32,
    pub winner: Option<Pubkey>,
    pub completed: bool,
    pub bump: u8,
}

impl MemeChallenge {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator Pubkey
        (4 + 100) + // title String
        (4 + 500) + // description String
        (4 + 300) + // prompt String
        8 * 3 + // u64 and i64 fields
        4 * 2 + // u32 fields
        (1 + 32) + // winner Option<Pubkey>
        1 + // completed bool
        1; // bump
}