use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(
    ctx: Context<CreateMemeChallenge>,
    title: String,
    description: String,
    prompt: String,
    reward_amount: u64,
    start_time: i64,
    end_time: i64,
) -> Result<()> {
    require!(title.len() <= 64, ErrorCode::TitleTooLong);
    require!(description.len() <= 256, ErrorCode::DescriptionTooLong);
    require!(prompt.len() <= 128, ErrorCode::PromptTooLong);
    require!(reward_amount > 0, ErrorCode::InvalidAmount);
    require!(end_time > start_time, ErrorCode::InvalidExpiry);
    require!(start_time > Clock::get()?.unix_timestamp, ErrorCode::InvalidExpiry);
    let challenge = &mut ctx.accounts.challenge;
    challenge.creator = ctx.accounts.creator.key();
    challenge.title = title;
    challenge.description = description;
    challenge.prompt = prompt;
    challenge.reward_amount = reward_amount;
    challenge.start_time = start_time;
    challenge.end_time = end_time;
    challenge.submission_count = 0;
    challenge.total_votes = 0;
    challenge.winner = None;
    challenge.completed = false;
    challenge.bump = ctx.bumps.challenge;
    Ok(())
}

#[derive(Accounts)]
#[instruction(start_time: i64)]
pub struct CreateMemeChallenge<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = fee_payer,
        space = MemeChallenge::LEN,
        seeds = [b"challenge", creator.key().as_ref(), &start_time.to_le_bytes()],
        bump,
    )]
    pub challenge: Account<'info, MemeChallenge>,

    pub system_program: Program<'info, System>,
}