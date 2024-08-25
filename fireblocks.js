const { FireblocksSDK } = require("fireblocks-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const apiSecret = fs.readFileSync(path.resolve(__dirname, process.env.FIREBLOCKS_SECRET_PATH), "utf8");
const fireblocks = new FireblocksSDK(apiSecret, process.env.FIREBLOCKS_API_KEY);

const generateDepositAddress = async (vaultAccountId, assetId) => {
  try {
    const address = await fireblocks.generateDepositAddress(vaultAccountId, assetId);
    console.log(`Generated deposit address for ${assetId}: ${address}`);
    return address;
  } catch (error) {
    console.error(`Error generating deposit address for ${assetId}:`, error);
    throw error;
  }
};

const monitorDeposits = async (vaultAccountId, assetId) => {
  try {
    // At some point we need to upgrade this to a webhook 
    const transactions = await fireblocks.getTransactions({
      assetId: assetId,
      type: "TRANSFER",
      status: "COMPLETED"
    });

    const deposits = transactions.filter(tx => tx.destination.id === vaultAccountId);
    if (deposits.length > 0) {
      console.log(`Detected ${deposits.length} deposits for ${assetId} in vault ${vaultAccountId}`);
      return deposits;
    } else {
      console.log(`No new deposits for ${assetId} in vault ${vaultAccountId}`);
      return [];
    }
  } catch (error) {
    console.error(`Error monitoring deposits for ${assetId}:`, error);
    throw error;
  }
};

const withdrawSolana = async (vaultAccountId, walletAddress, amount) => {
  try {
    const transaction = await fireblocks.createTransaction({
      source: {
        type: "VAULT_ACCOUNT",
        id: vaultAccountId,
      },
      destination: {
        type: "EXTERNAL_WALLET",
        id: walletAddress,
      },
      assetId: "SOL",
      amount: amount.toString(),
      operation: "TRANSFER",
    });
    return transaction;
  } catch (error) {
    console.error("Error during Solana withdrawal:", error);
    throw error;
  }
};

const transferSolana = async (fromWalletId, toWalletId, amount) => {
  try {
    const transaction = await fireblocks.createTransaction({
      source: {
        type: "VAULT_ACCOUNT",
        id: fromWalletId,
      },
      destination: {
        type: "VAULT_ACCOUNT",
        id: toWalletId,
      },
      assetId: "SOL",
      amount: amount.toString(),
      operation: "TRANSFER",
    });
    return transaction;
  } catch (error) {
    console.error("Error during Solana transfer:", error);
    throw error;
  }
};

const getTransactionStatus = async (transactionId) => {
  try {
    const status = await fireblocks.getTransactionById(transactionId);
    console.log(`Transaction status for ${transactionId}:`, status.status);
    return status;
  } catch (error) {
    console.error(`Error fetching status for transaction ${transactionId}:`, error);
    throw error;
  }
};

const listAllVaultAssets = async (vaultAccountId) => {
  try {
    const assets = await fireblocks.getVaultAccountAsset(vaultAccountId);
    console.log(`Assets in vault ${vaultAccountId}:`, assets);
    return assets;
  } catch (error) {
    console.error(`Error listing assets for vault ${vaultAccountId}:`, error);
    throw error;
  }
};

module.exports = { 
  generateDepositAddress,
  monitorDeposits,
  withdrawSolana, 
  transferSolana, 
  getTransactionStatus, 
  listAllVaultAssets 
};
