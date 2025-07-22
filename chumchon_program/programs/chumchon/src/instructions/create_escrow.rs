use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(
    ctx: Context<CreateEscrow>,
    counterparty: Pubkey,
    group: Pubkey,
    initiator_amount: u64,
    counterparty_token: Pubkey,
    counterparty_amount: u64,
    expires_at: i64,
    created_at: i64,
) -> Result<()> {
    require_gt!(initiator_amount, 0, ErrorCode::InvalidAmount);
    require_gt!(counterparty_amount, 0, ErrorCode::InvalidAmount);
    require!(expires_at > created_at, ErrorCode::InvalidExpiry);

    let escrow = &mut ctx.accounts.escrow;

    escrow.initiator = ctx.accounts.initiator.key();
    escrow.counterparty = counterparty;
    escrow.group = group;
    escrow.initiator_token = ctx.accounts.initiator_token_account.mint;
    escrow.initiator_amount = initiator_amount;
    escrow.counterparty_token = counterparty_token;
    escrow.counterparty_amount = counterparty_amount;
    escrow.created_at = created_at;
    escrow.expires_at = expires_at;
    escrow.accepted = false;
    escrow.completed = false;
    escrow.bump = ctx.bumps.escrow;

    let cpi_accounts = Transfer {
        from: ctx.accounts.initiator_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account_initiator.to_account_info(),
        authority: ctx.accounts.initiator.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::transfer(cpi_context, initiator_amount)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(created_at: i64)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub initiator: Signer<'info>,

    #[account(
        init,
        payer = fee_payer,
        space = Escrow::LEN,
        seeds = [b"escrow", initiator.key().as_ref(), &created_at.to_le_bytes()],
        bump,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub initiator_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub escrow_token_account_initiator: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}