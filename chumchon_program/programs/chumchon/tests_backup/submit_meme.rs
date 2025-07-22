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
async fn submit_meme_ix_success() {
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
	let creator: Pubkey = Pubkey::default();
	let start_time: i64 = Default::default();
	let image_url: String = "test_image_url".to_string();
	let title: String = "Test Title".to_string();
	let description: String = "Test Description".to_string();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let submitter_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let submitter_pubkey = submitter_keypair.pubkey();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (challenge_pda, _challenge_pda_bump) = Pubkey::find_program_address(
		&[
			b"challenge",
			creator.as_ref(),
			start_time.to_le_bytes().as_ref(),
		],
		&chumchon::ID,
	);

	let (submission_pda, _submission_pda_bump) = Pubkey::find_program_address(
		&[
			b"submission",
			challenge_pda.as_ref(),
			submitter_pubkey.as_ref(),
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
		submitter_pubkey,
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

	let ix = chumchon_ix_interface::submit_meme_ix_setup(
		&fee_payer_keypair,
		challenge_pda,
		submission_pda,
		&submitter_keypair,
		system_program_pubkey,
		&image_url,
		&title,
		&description,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}