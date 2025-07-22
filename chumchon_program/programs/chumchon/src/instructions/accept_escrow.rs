use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<AcceptEscrow>, created_at: i64) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;
    require!(!escrow.accepted, ErrorCode::EscrowAlreadyAccepted);
    require!(escrow.expires_at >= clock.unix_timestamp, ErrorCode::EscrowExpired);
    escrow.accepted = true;
    Ok(())
}

#[derive(Accounts)]
#[instruction(created_at: i64)]
pub struct AcceptEscrow<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", escrow.initiator.as_ref(), &created_at.to_le_bytes()],
        bump = escrow.bump,
        constraint = escrow.counterparty == counterparty.key() @ ErrorCode::NotOwner,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub counterparty: Signer<'info>,

    pub system_program: Program<'info, System>,
}