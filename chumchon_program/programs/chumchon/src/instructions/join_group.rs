use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

use crate::state::*;
use crate::error::ErrorCode;

pub fn handler(ctx: Context<JoinGroup>) -> Result<()> {
    let group = &ctx.accounts.group;
    let member = &ctx.accounts.member;
    let member_record = &mut ctx.accounts.member_record;

    // Check SOL balance for whale groups
    if group.is_whale_group {
        require!(member.lamports() >= group.required_sol_balance, ErrorCode::InsufficientSolBalance);
    }

    // Check token balance if required
    if let Some(required_token_mint) = group.required_token {
        let token_account_info = ctx.accounts.member_token_account.as_ref()
            .ok_or(ErrorCode::InvalidToken)?;
        let mut data: &[u8] = &token_account_info.try_borrow_data()?;
        let token_account = TokenAccount::try_deserialize(&mut data)?;
        require_keys_eq!(token_account.mint, required_token_mint, ErrorCode::InvalidToken);
        require!(token_account.amount >= group.required_amount, ErrorCode::InsufficientTokenBalance);
    }

    // Check NFT ownership if required
    if let Some(required_nft_collection) = group.required_nft_collection {
        let nft_account_info = ctx.accounts.member_nft_account.as_ref()
            .ok_or(ErrorCode::NoNFT)?;
        let mut data: &[u8] = &nft_account_info.try_borrow_data()?;
        let nft_account = TokenAccount::try_deserialize(&mut data)?;
        require_keys_eq!(nft_account.mint, required_nft_collection, ErrorCode::InvalidNFT);
        require_eq!(nft_account.amount, 1, ErrorCode::NoNFT);
    }

    let clock = Clock::get()?.unix_timestamp;
    member_record.group = group.key();
    member_record.member = member.key();
    member_record.joined_at = clock;
    member_record.bump = ctx.bumps.member_record;

    // Update group member count
    let group_account = &mut ctx.accounts.group;
    group_account.member_count += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct JoinGroup<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(mut)]
    pub member: Signer<'info>,

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

    /// CHECK: Optional token account for groups requiring tokens
    pub member_token_account: Option<AccountInfo<'info>>,

    /// CHECK: Optional NFT account for groups requiring NFTs
    pub member_nft_account: Option<AccountInfo<'info>>,

    pub system_program: Program<'info, System>,
}