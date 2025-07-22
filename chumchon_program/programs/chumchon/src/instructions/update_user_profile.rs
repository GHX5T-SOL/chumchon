use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(
    ctx: Context<UpdateUserProfile>,
    username: String,
    bio: String,
    show_balance: bool,
) -> Result<()> {
    require!(username.len() <= 50, ErrorCode::NameTooLong);
    require!(bio.len() <= 200, ErrorCode::BioTooLong);
    let profile = &mut ctx.accounts.profile;
    let clock = Clock::get()?.unix_timestamp;
    profile.username = username;
    profile.bio = bio;
    profile.show_balance = show_balance;
    profile.last_active = clock;
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateUserProfile<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user", owner.key().as_ref()],
        bump = profile.bump,
        constraint = profile.owner == owner.key() @ ErrorCode::NotOwner,
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}