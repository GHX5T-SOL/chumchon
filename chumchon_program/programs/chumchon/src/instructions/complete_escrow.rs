use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<CompleteEscrow>, created_at: i64) -> Result<()> {
    require!(ctx.accounts.escrow.accepted, ErrorCode::EscrowNotAccepted);
    let escrow = &mut ctx.accounts.escrow;
    escrow.completed = true;
    Ok(())
}

#[derive(Accounts)]
#[instruction(created_at: i64)]
pub struct CompleteEscrow<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", escrow.initiator.as_ref(), &created_at.to_le_bytes()],
        bump = escrow.bump,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub initiator: Signer<'info>,

    pub system_program: Program<'info, System>,
}