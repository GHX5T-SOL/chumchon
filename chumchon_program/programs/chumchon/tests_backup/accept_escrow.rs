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
async fn accept_escrow_ix_success() {
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
	let initiator: Pubkey = Pubkey::default();
	let created_at: i64 = Default::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let counterparty_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let counterparty_pubkey = counterparty_keypair.pubkey();
	let counterparty_token_account_pubkey = Pubkey::new_unique();
	let escrow_token_account_pubkey = Pubkey::new_unique();

	// PDA
	let (escrow_pda, _escrow_pda_bump) = Pubkey::find_program_address(
		&[
			b"escrow",
			initiator.as_ref(),
			counterparty_pubkey.as_ref(),
			created_at.to_le_bytes().as_ref(),
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
		counterparty_pubkey,
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

	let ix = chumchon_ix_interface::accept_escrow_ix_setup(
		&fee_payer_keypair,
		escrow_pda,
		&counterparty_keypair,
		counterparty_token_account_pubkey,
		escrow_token_account_pubkey,
		created_at,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
