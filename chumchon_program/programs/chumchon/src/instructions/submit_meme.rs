use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(
    ctx: Context<SubmitMeme>,
    image_url: String,
    title: String,
    description: String,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    let clock = Clock::get()?;
    
    require!(clock.unix_timestamp > challenge.start_time, ErrorCode::ChallengeNotStarted);
    require!(clock.unix_timestamp < challenge.end_time, ErrorCode::ChallengeEnded);
    require!(image_url.len() <= 256, ErrorCode::UrlTooLong);
    require!(title.len() <= 64, ErrorCode::TitleTooLong);
    require!(description.len() <= 256, ErrorCode::DescriptionTooLong);
    
    let submission = &mut ctx.accounts.submission;
    submission.challenge = challenge.key();
    submission.submitter = ctx.accounts.submitter.key();
    submission.image_url = image_url;
    submission.title = title;
    submission.description = description;
    submission.votes = 0;
    submission.submitted_at = clock.unix_timestamp;
    submission.bump = ctx.bumps.submission;
    
    challenge.submission_count += 1;
    
    Ok(())
}

#[derive(Accounts)]
pub struct SubmitMeme<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub submitter: Signer<'info>,

    #[account(
        mut,
        seeds = [b"challenge", challenge.creator.as_ref(), &challenge.start_time.to_le_bytes()],
        bump = challenge.bump,
    )]
    pub challenge: Account<'info, MemeChallenge>,

    #[account(
        init,
        payer = fee_payer,
        space = MemeSubmission::LEN,
        seeds = [b"submission", challenge.key().as_ref(), submitter.key().as_ref()],
        bump,
    )]
    pub submission: Account<'info, MemeSubmission>,

    pub system_program: Program<'info, System>,
}