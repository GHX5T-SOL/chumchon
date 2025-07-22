use anchor_lang::prelude::*;

#[account]
pub struct Group {
    pub name: String,
    pub description: String,
    pub creator: Pubkey,
    pub is_channel: bool,
    pub is_whale_group: bool,
    pub required_token: Option<Pubkey>,
    pub required_amount: u64,
    pub required_nft_collection: Option<Pubkey>,
    pub required_sol_balance: u64,
    pub member_count: u32,
    pub created_at: i64,
    pub last_message_at: i64,
    pub message_count: u64,
    pub bump: u8,
}

impl Group {
    pub const LEN: usize = 8 + // discriminator
        (4 + 32) + // name String
        (4 + 256) + // description String
        32 + // creator Pubkey
        1 * 2 + // bools
        (1 + 32) * 2 + // Options<Pubkey>
        8 * 4 + // u64/i64
        4 + // u32
        1; // bump
}