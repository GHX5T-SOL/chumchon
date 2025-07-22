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
async fn create_escrow_ix_success() {
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
	let counterparty: Pubkey = Pubkey::default();
	let group: Pubkey = Pubkey::default();
	let initiator_token: Pubkey = Pubkey::default();
	let initiator_amount: u64 = Default::default();
	let counterparty_token: Pubkey = Pubkey::default();
	let counterparty_amount: u64 = Default::default();
	let expires_at: i64 = Default::default();
	let created_at: i64 = Default::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let initiator_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let initiator_pubkey = initiator_keypair.pubkey();
	let initiator_token_account_pubkey = Pubkey::new_unique();
	let escrow_token_account_pubkey = Pubkey::new_unique();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (escrow_pda, _escrow_pda_bump) = Pubkey::find_program_address(
		&[
			b"escrow",
			initiator_pubkey.as_ref(),
			counterparty.as_ref(),
			created_at.to_le_bytes().as_ref(),
		],
		&chumchon::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		fee_payer_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		initiator_pubkey,
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

	let ix = chumchon_ix_interface::create_escrow_ix_setup(
		&fee_payer_keypair,
		escrow_pda,
		&initiator_keypair,
		initiator_token_account_pubkey,
		escrow_token_account_pubkey,
		system_program_pubkey,
		counterparty,
		group,
		initiator_amount,
		counterparty_token,
		counterparty_amount,
		expires_at,
		created_at,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
