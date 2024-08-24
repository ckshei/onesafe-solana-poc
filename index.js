const { 
  depositSolana, 
  depositUSDCOnSolana, 
  withdrawSolana, 
  transferSolana, 
  getTransactionStatus, 
  listAllVaultAssets 
} = require('./fireblocks');

const { 
  createInvoice, 
  payInvoice, 
  sendReceipt 
} = require('./invoice');

const main = async ({
  vaultAccountId,
  walletAddress,
  depositAmount,
  withdrawalAmount,
  transferAmount,
  invoiceAmount,
  payerPrivateKey,
  payerEmail,
  dueDate,
  transactionId
}) => {
  try {
    if (depositAmount && depositAmount > 0) {
      const depositResult = await depositSolana(vaultAccountId, depositAmount);
      console.log(`Deposited ${depositAmount} SOL to vault:`, depositResult);
    }

    if (withdrawalAmount && withdrawalAmount > 0) {
      const withdrawalResult = await withdrawSolana(vaultAccountId, walletAddress, withdrawalAmount);
      console.log(`Withdrew ${withdrawalAmount} SOL to wallet:`, withdrawalResult);
    }

    if (transferAmount && transferAmount > 0) {
      const transferResult = await transferSolana(vaultAccountId, walletAddress, transferAmount);
      console.log(`Transferred ${transferAmount} SOL to wallet:`, transferResult);
    }

    if (invoiceAmount && invoiceAmount > 0 && payerEmail && dueDate) {
      const invoice = createInvoice('invoice_id_123', walletAddress, invoiceAmount, 'USDC_SOLANA', payerEmail, dueDate);
      console.log(`Created invoice for ${invoiceAmount} USDC on Solana:`, invoice);

      const paymentResult = await payInvoice(invoice.invoiceId, payerPrivateKey);
      console.log(`Paid invoice for ${invoiceAmount} USDC on Solana:`, paymentResult);

      await sendReceipt(invoice);
    }

    if (transactionId) {
      const transactionStatus = await getTransactionStatus(transactionId);
      console.log(`Transaction status for ${transactionId}:`, transactionStatus);
    }

    const vaultAssets = await listAllVaultAssets(vaultAccountId);
    console.log(`Assets in vault ${vaultAccountId}:`, vaultAssets);

  } catch (err) {
    console.error("An error occurred during operations:", err);
  }
};

const dynamicInputs = {
  vaultAccountId: process.env.VAULT_ACCOUNT_ID,
  walletAddress: process.env.WALLET_ADDRESS,
  depositAmount: parseFloat(process.env.DEPOSIT_AMOUNT),
  withdrawalAmount: parseFloat(process.env.WITHDRAWAL_AMOUNT),
  transferAmount: parseFloat(process.env.TRANSFER_AMOUNT),
  invoiceAmount: parseFloat(process.env.INVOICE_AMOUNT),
  payerPrivateKey: process.env.PAYER_PRIVATE_KEY,
  payerEmail: process.env.PAYER_EMAIL,
  dueDate: process.env.DUE_DATE,
  transactionId: process.env.TRANSACTION_ID
};

main(dynamicInputs);
