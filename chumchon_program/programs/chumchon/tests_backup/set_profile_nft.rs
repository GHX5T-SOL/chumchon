pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		chumchon_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn set_profile_nft_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// DATA
	let nft_mint: Pubkey = Pubkey::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let owner_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let owner_pubkey = owner_keypair.pubkey();
	let nft_token_account_pubkey = Pubkey::new_unique();

	// PDA
	let (profile_pda, _profile_pda_bump) = Pubkey::find_program_address(
		&[
			b"user",
			owner_pubkey.as_ref(),
		],
		&chumchon::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		fee_payer_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		owner_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = chumchon_ix_interface::set_profile_nft_ix_setup(
		&fee_payer_keypair,
		profile_pda,
		&owner_keypair,
		nft_token_account_pubkey,
		nft_mint,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
