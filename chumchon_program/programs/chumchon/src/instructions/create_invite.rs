use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(
    ctx: Context<CreateInvite>,
    code: String,
    max_uses: u32,
    expires_at: i64,
) -> Result<()> {
    require!(code.len() <= 32, ErrorCode::CodeTooLong);
    require!(max_uses > 0, ErrorCode::InvalidMaxUses);
    require!(expires_at > Clock::get()?.unix_timestamp, ErrorCode::InvalidExpiry);
    let invite = &mut ctx.accounts.invite;
    invite.creator = ctx.accounts.creator.key();
    invite.group = ctx.accounts.group.key();
    invite.code = code;
    invite.max_uses = max_uses;
    invite.uses = 0;
    invite.expires_at = expires_at;
    invite.bump = ctx.bumps.invite;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateInvite<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        init,
        payer = fee_payer,
        space = Invite::LEN,
        seeds = [b"invite", group.key().as_ref(), code.as_bytes()],
        bump,
    )]
    pub invite: Account<'info, Invite>,

    #[account(
        seeds = [b"group", group.name.as_bytes(), group.creator.as_ref()],
        bump = group.bump,
        constraint = group.creator == creator.key() @ ErrorCode::NotGroupCreator,
    )]
    pub group: Account<'info, Group>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}