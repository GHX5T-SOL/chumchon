use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<VoteForMeme>) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    let submission = &mut ctx.accounts.submission;
    let clock = Clock::get()?;
    require!(challenge.start_time < clock.unix_timestamp && clock.unix_timestamp < challenge.end_time, ErrorCode::ChallengeInactive);
    require_neq!(submission.submitter, ctx.accounts.voter.key(), ErrorCode::CannotVoteOwnSubmission);
    submission.votes += 1;
    challenge.total_votes += 1;
    Ok(())
}

#[derive(Accounts)]
pub struct VoteForMeme<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub voter: Signer<'info>,

    #[account(
        mut,
        seeds = [b"submission", challenge.key().as_ref(), submitter.key().as_ref()],
        bump = submission.bump,
    )]
    pub submission: Account<'info, MemeSubmission>,

    #[account(
        seeds = [b"challenge", challenge.creator.as_ref(), &challenge.start_time.to_le_bytes()],
        bump = challenge.bump,
    )]
    pub challenge: Account<'info, MemeChallenge>,

    /// CHECK: This is the submitter of the meme
    pub submitter: AccountInfo<'info>,

    #[account(
        init,
        payer = fee_payer,
        space = VoterRecord::LEN,
        seeds = [b"voter", submission.key().as_ref(), voter.key().as_ref()],
        bump,
    )]
    pub voter_record: Account<'info, VoterRecord>,

    pub system_program: Program<'info, System>,
}