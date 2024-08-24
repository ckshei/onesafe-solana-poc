const { transferSolana, depositUSDCOnSolana } = require('./fireblocks');
const nodemailer = require('nodemailer');

const invoices = {};

const createInvoice = (invoiceId, payerAddress, amount, currency = 'USDC_SOLANA', email, dueDate) => {
  if (!invoiceId || !payerAddress || !amount || !dueDate) {
    throw new Error('Missing required invoice parameters');
  }

  const invoice = {
    invoiceId,
    payerAddress,
    amount,
    currency,
    email,
    paid: false,
    createdAt: new Date(),
    dueDate: new Date(dueDate),
    receiptSent: false,
  };

  invoices[invoiceId] = invoice;
  console.log(`Invoice created successfully:`, invoice);
  return invoice;
};

const payInvoice = async (invoiceId, payerPrivateKey) => {
  const invoice = invoices[invoiceId];

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.paid) {
    throw new Error('Invoice already paid');
  }

  if (new Date() > invoice.dueDate) {
    throw new Error('Invoice is past due date');
  }

  try {
    let paymentResult;
    if (invoice.currency === 'USDC_SOLANA') {
      paymentResult = await depositUSDCOnSolana(invoice.payerAddress, invoice.amount, payerPrivateKey);
    } else if (invoice.currency === 'SOL') {
      paymentResult = await transferSolana(invoice.payerAddress, process.env.RECIPIENT_WALLET_ADDRESS, invoice.amount, payerPrivateKey);
    } else {
      throw new Error(`Unsupported currency: ${invoice.currency}`);
    }

    invoice.paid = true;
    invoice.paidAt = new Date();
    console.log(`Invoice ${invoiceId} paid successfully:`, paymentResult);

    if (invoice.email) {
      await sendReceipt(invoice);
      invoice.receiptSent = true;
    }

    return paymentResult;
  } catch (error) {
    console.error(`Error paying invoice ${invoiceId}:`, error);
    throw error;
  }
};

const sendReceipt = async (invoice) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP
