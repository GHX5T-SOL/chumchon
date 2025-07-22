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
async fn use_invite_ix_success() {
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
	let name: String = Default::default();
	let code: String = Default::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let member_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let member_pubkey = member_keypair.pubkey();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (group_pda, _group_pda_bump) = Pubkey::find_program_address(
		&[
			b"group",
			name.as_bytes().as_ref(),
			creator.as_ref(),
		],
		&chumchon::ID,
	);

	let (invite_pda, _invite_pda_bump) = Pubkey::find_program_address(
		&[
			b"invite",
			group_pda.as_ref(),
			code.as_bytes().as_ref(),
		],
		&chumchon::ID,
	);

	let (member_record_pda, _member_record_pda_bump) = Pubkey::find_program_address(
		&[
			b"member",
			group_pda.as_ref(),
			member_pubkey.as_ref(),
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
		member_pubkey,
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

	let ix = chumchon_ix_interface::use_invite_ix_setup(
		&fee_payer_keypair,
		invite_pda,
		group_pda,
		&member_keypair,
		member_record_pda,
		system_program_pubkey,
		&code,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
