const { FireblocksSDK } = require("fireblocks-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const apiSecret = fs.readFileSync(path.resolve(__dirname, process.env.FIREBLOCKS_SECRET_PATH), "utf8");
const fireblocks = new FireblocksSDK(apiSecret, process.env.FIREBLOCKS_API_KEY);

const generateDepositAddress = async (vaultAccountId, assetId) => {
  try {
    const address = await fireblocks.generateDepositAddress(vaultAccountId, assetId);
    return address;
  } catch (error) {
    console.error(`Error generating deposit address for ${assetId}:`, error);
    throw error;
  }
};

const createTransaction = async (sourceId, destinationId, assetId, amount) => {
  try {
    const transaction = await fireblocks.createTransaction({
      source: {
        type: "VAULT_ACCOUNT",
        id: sourceId,
      },
      destination: {
        type: "EXTERNAL_WALLET",
        id: destinationId,
      },
      assetId: assetId,
      amount: amount.toString(),
      operation: "TRANSFER",
    });

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

const depositSolana = async (vaultAccountId, amount) => {
  try {
    const solanaDepositAddress = await generateDepositAddress(vaultAccountId, "SOL");
    return await createTransaction(solanaDepositAddress, vaultAccountId, "SOL", amount);
  } catch (error) {
    console.error("Error during Solana deposit:", error);
    throw error;
  }
};

const depositUSDCOnSolana = async (vaultAccountId, amount) => {
  try {
    const usdcDepositAddress = await generateDepositAddress(vaultAccountId, "USDC_SOLANA");
    return await createTransaction(usdcDepositAddress, vaultAccountId, "USDC_SOLANA", amount);
  } catch (error) {
    console.error("Error during USDC deposit on Solana:", error);
    throw error;
  }
};

const withdrawSolana = async (vaultAccountId, walletAddress, amount) => {
  try {
    return await createTransaction(vaultAccountId, walletAddress, "SOL", amount);
  } catch (error) {
    console.error("Error during Solana withdrawal:", error);
    throw error;
  }
};

const transferSolana = async (fromWalletId, toWalletId, amount) => {
  try {
    return await createTransaction(fromWalletId, toWalletId, "SOL", amount);
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
  depositSolana, 
  depositUSDCOnSolana, 
  withdrawSolana, 
  transferSolana, 
  getTransactionStatus, 
  listAllVaultAssets 
};
