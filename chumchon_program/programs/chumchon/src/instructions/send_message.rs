use anchor_lang::prelude::*;

use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct SendMessage<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"group", group.name.as_bytes(), group.creator.as_ref()],
        bump = group.bump,
    )]
    pub group: Account<'info, Group>,

    #[account(
        seeds = [b"member", group.key().as_ref(), sender.key().as_ref()],
        bump = member_record.bump,
        constraint = member_record.member == sender.key() @ ErrorCode::NotGroupMember,
    )]
    pub member_record: Account<'info, GroupMember>,

    #[account(
        init,
        payer = fee_payer,
        space = Message::LEN,
        seeds = [b"message", group.key().as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub message: Account<'info, Message>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SendMessage>, content: String) -> Result<()> {
    require!(content.len() <= 1000, ErrorCode::ContentTooLong);
    
    let group = &ctx.accounts.group;
    let sender = &ctx.accounts.sender;
    let member_record = &ctx.accounts.member_record;

    // Check if user is a member of the group
    require_keys_eq!(member_record.group, group.key(), ErrorCode::NotGroupMember);
    require_keys_eq!(member_record.member, sender.key(), ErrorCode::NotGroupMember);

    // Check if it's a channel and if the sender is the creator
    if group.is_channel {
        require_keys_eq!(group.creator, sender.key(), ErrorCode::ChannelPostingRestricted);
    }

    let message = &mut ctx.accounts.message;
    let clock = Clock::get()?.unix_timestamp;
    message.group = group.key();
    message.sender = sender.key();
    message.content = content;
    message.timestamp = clock;
    message.tips_received = 0;
    message.bump = ctx.bumps.message;

    Ok(())
}