use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<CompleteTutorial>, tutorial_id: u8) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    require!(!profile.completed_tutorials.contains(&tutorial_id), ErrorCode::TutorialAlreadyCompleted);
    require!(tutorial_id <= 10, ErrorCode::InvalidTutorialId);
    profile.completed_tutorials.push(tutorial_id);
    profile.tutorial_rewards += 1000; // 1000 lamports per tutorial
    Ok(())
}

#[derive(Accounts)]
pub struct CompleteTutorial<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump = profile.bump,
        constraint = profile.owner == user.key() @ ErrorCode::NotOwner,
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}