use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(
    ctx: Context<CreateGroup>,
    name: String,
    description: String,
    is_channel: bool,
    is_whale_group: bool,
    required_token: Option<Pubkey>,
    required_amount: u64,
    required_nft_collection: Option<Pubkey>,
    required_sol_balance: u64,
) -> Result<()> {
    require!(name.len() <= 32, ErrorCode::NameTooLong);
    require!(description.len() <= 256, ErrorCode::DescriptionTooLong);

    let group = &mut ctx.accounts.group;
    let clock = Clock::get()?.unix_timestamp;
    group.creator = ctx.accounts.creator.key();
    group.name = name;
    group.description = description;
    group.is_channel = is_channel;
    group.is_whale_group = is_whale_group;
    group.required_token = required_token;
    group.required_amount = required_amount;
    group.required_nft_collection = required_nft_collection;
    group.required_sol_balance = required_sol_balance;
    group.created_at = clock;
    group.member_count = 0;
    group.bump = ctx.bumps.group;

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateGroup<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = fee_payer,
        space = Group::LEN,
        seeds = [b"group", name.as_bytes(), creator.key().as_ref()],
        bump,
    )]
    pub group: Account<'info, Group>,

    pub system_program: Program<'info, System>,
}