#!/bin/bash

# Create a tests_backup directory if it doesn't exist
mkdir -p tests_backup

# Move all test files to the backup directory
mv programs/chumchon/tests/*.rs tests_backup/

# Create a simple placeholder test file
mkdir -p programs/chumchon/tests
touch programs/chumchon/tests/placeholder.rs

echo "Tests have been temporarily moved. Running anchor build..."

# Run anchor build
anchor build

# Move the test files back
rm programs/chumchon/tests/placeholder.rs
mv tests_backup/*.rs programs/chumchon/tests/
rmdir tests_backup

echo "Tests have been restored."