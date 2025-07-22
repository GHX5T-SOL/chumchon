use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<UseInvite>, invite_code: String) -> Result<()> {
    let invite = &mut ctx.accounts.invite;
    let group = &mut ctx.accounts.group;
    let member_record = &mut ctx.accounts.member_record;
    
    require!(invite.expires_at > Clock::get()?.unix_timestamp, ErrorCode::InviteExpired);
    require!(invite.uses < invite.max_uses, ErrorCode::InviteUsed);
    
    invite.uses += 1;
    member_record.group = group.key();
    member_record.member = ctx.accounts.member.key();
    member_record.joined_at = Clock::get()?.unix_timestamp;
    member_record.bump = ctx.bumps.member_record;
    group.member_count = group.member_count.checked_add(1).unwrap();
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(invite_code: String)]
pub struct UseInvite<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub member: Signer<'info>,

    #[account(
        mut,
        seeds = [b"invite", group.key().as_ref(), invite_code.as_bytes()],
        bump = invite.bump,
    )]
    pub invite: Account<'info, Invite>,

    #[account(mut)]
    pub group: Account<'info, Group>,

    #[account(
        init,
        payer = fee_payer,
        space = GroupMember::LEN,
        seeds = [b"member", group.key().as_ref(), member.key().as_ref()],
        bump,
    )]
    pub member_record: Account<'info, GroupMember>,

    pub system_program: Program<'info, System>,
}