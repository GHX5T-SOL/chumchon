use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<TipMessage>, message_id: u64, amount: u64) -> Result<()> {
    require_gt!(amount, 0, ErrorCode::InvalidAmount);
    let message = &mut ctx.accounts.message;
    message.tips_received += amount;

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: ctx.accounts.tipper.to_account_info(),
            to: ctx.accounts.recipient.to_account_info(),
        },
    );
    anchor_lang::system_program::transfer(cpi_context, amount)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(message_id: u64)]
pub struct TipMessage<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    #[account(
        mut,
        seeds = [b"message", group.key().as_ref(), &message_id.to_le_bytes()],
        bump = message.bump,
    )]
    pub message: Account<'info, Message>,

    #[account(
        seeds = [b"group", group.name.as_bytes(), group.creator.as_ref()],
        bump = group.bump,
    )]
    pub group: Account<'info, Group>,

    /// CHECK: This is the recipient of the tip (message sender)
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}