use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

use crate::state::*;
use crate::error::ErrorCode;


#[derive(Accounts)]
#[instruction(nft_mint: Pubkey)]
pub struct SetProfileNft<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user", owner.key().as_ref()],
        bump = profile.bump,
        constraint = profile.owner == owner.key() @ ErrorCode::NotOwner
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        constraint = nft_token_account.owner == owner.key() @ ErrorCode::NotOwner,
        constraint = nft_token_account.amount == 1 @ ErrorCode::NoNFT,
        constraint = nft_token_account.mint == nft_mint @ ErrorCode::InvalidMint,
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    pub nft_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<SetProfileNft>,
    nft_mint: Pubkey,
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    profile.nft_profile_picture = Some(nft_mint);
    Ok(())
}