#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod error;
pub mod state;

pub use state::*;

declare_id!("CVjwSHMQ9YTenzKwQczwXWzJFk5kwaUhKDtxDKVazJXj");

#[program]
pub mod chumchon {
    use super::*;
    use crate::error::ErrorCode;

    pub fn create_user_profile(
        ctx: Context<CreateUserProfile>,
        username: String,
        bio: String,
        show_balance: bool,
    ) -> Result<()> {
        require!(username.len() <= 50, ErrorCode::NameTooLong);
        require!(bio.len() <= 200, ErrorCode::BioTooLong);
        let profile = &mut ctx.accounts.profile;
        let clock = Clock::get()?.unix_timestamp;
        profile.owner = ctx.accounts.owner.key();
        profile.username = username;
        profile.bio = bio;
        profile.profile_picture_url = None;
        profile.nft_profile_picture = None;
        profile.show_balance = show_balance;
        profile.created_at = clock;
        profile.last_active = clock;
        profile.completed_tutorials = Vec::new();
        profile.tutorial_rewards = 0;
        profile.bump = ctx.bumps.profile;
        Ok(())
    }

    pub fn update_user_profile(
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
}

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        init,
        payer = fee_payer,
        space = UserProfile::LEN,
        seeds = [b"user", owner.key().as_ref()],
        bump,
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserProfile<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user", owner.key().as_ref()],
        bump = profile.bump,
        constraint = profile.owner == owner.key() @ crate::error::ErrorCode::NotOwner,
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}