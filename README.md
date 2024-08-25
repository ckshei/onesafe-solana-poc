
# OneSafe PoC - MultiChain Wallet Integration

## Overview

This project is a Proof of Concept (PoC) for integrating Solana into the OneSafe platform. It includes support for handling Solana-based transactions and managing USDC invoices on the Solana blockchain.

## Features

- **Solana Wallet Support**: Enables deposits, withdrawals, and transfers of SOL.
- **USDC on Solana**: Manage USDC transactions, including invoice creation and payment.
- **Invoice Management**: Create and pay invoices with USDC, with support for sending receipts

## File Structure

### `index.js`

- The main entry point of the application.
- Orchestrates the various wallet operations, including deposits, withdrawals, transfers, and invoice management.
- Handles dynamic inputs for different operations.

### `fireblocks.js`

- Contains functions for interacting with the Fireblocks API.
- Supports:
  - **Depositing SOL**: Adds SOL to the Fireblocks vault.
  - **Withdrawing SOL**: Withdraws SOL from the vault to an external wallet.
  - **Transferring SOL**: Transfers SOL between wallets.
  - **Managing USDC on Solana**: Handles deposits of USDC on the Solana blockchain.

### `invoice.js`

- Manages invoice-related operations.
- Supports:
  - **Creating Invoices**: Generates invoices in USDC on Solana.
  - **Paying Invoices**: Processes invoice payments.
  - **Sending Receipts**: Sends email receipts once an invoice is paid.

## How to Use

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ckshei/onesafe-poc-multichain.git
   cd onesafe-poc-multichain
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file with the necessary configuration details like API keys, wallet addresses, and email credentials.

4. **Run the Application**:
   - Use the command `node index.js` to execute the main file and perform the wallet operations as configured.
