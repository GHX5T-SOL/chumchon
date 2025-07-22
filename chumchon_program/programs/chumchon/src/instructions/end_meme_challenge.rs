use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<EndMemeChallenge>) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    let clock = Clock::get()?;
    require!(clock.unix_timestamp >= challenge.end_time, ErrorCode::ChallengeNotEnded);
    require!(!challenge.completed, ErrorCode::ChallengeAlreadyCompleted);
    require!(challenge.submission_count > 0, ErrorCode::NoSubmissions);
    challenge.completed = true;
    Ok(())
}

#[derive(Accounts)]
pub struct EndMemeChallenge<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"challenge", challenge.creator.as_ref(), &challenge.start_time.to_le_bytes()],
        bump = challenge.bump,
        constraint = challenge.creator == creator.key() @ ErrorCode::NotGroupCreator,
    )]
    pub challenge: Account<'info, MemeChallenge>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}