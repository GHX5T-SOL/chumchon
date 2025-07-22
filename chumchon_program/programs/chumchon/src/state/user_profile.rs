use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub username: String,  // Assume max 50 chars
    pub bio: String,       // Assume max 200 chars
    pub profile_picture_url: Option<String>, // Assume max 200 chars if present
    pub nft_profile_picture: Option<Pubkey>,
    pub show_balance: bool,
    pub created_at: i64,
    pub last_active: i64,
    pub completed_tutorials: Vec<u8>, // Assume max 10 tutorials
    pub tutorial_rewards: u64,
    pub bump: u8,
}

impl UserProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner Pubkey
        (4 + 50) + // username String
        (4 + 200) + // bio String
        (1 + 4 + 200) + // profile_picture_url Option<String>
        (1 + 32) + // nft_profile_picture Option<Pubkey>
        1 + // show_balance bool
        8 * 2 + // created_at and last_active i64
        (4 + 10) + // completed_tutorials Vec<u8>
        8 + // tutorial_rewards u64
        1; // bump u8
}