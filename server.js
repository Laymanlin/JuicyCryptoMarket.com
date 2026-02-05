const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for demo accounts
const demoAccounts = new Map();
const DEMO_INITIAL_BALANCE = 1000000000; // $1 billion

// Demo login endpoint
app.post('/api/demo-login', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Create or retrieve demo account
  if (!demoAccounts.has(email)) {
    demoAccounts.set(email, {
      email,
      balance: DEMO_INITIAL_BALANCE,
      holdings: {},
      transactions: []
    });
  }

  const account = demoAccounts.get(email);
  
  res.json({
    success: true,
    account: {
      email: account.email,
      balance: account.balance,
      holdings: account.holdings,
      isDemo: true
    },
    message: 'Demo account logged in successfully with $1 billion balance'
  });
});

// Get balance endpoint
app.get('/api/get-balance', (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const account = demoAccounts.get(email);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json({
    balance: account.balance,
    holdings: account.holdings
  });
});

// Reset demo balance endpoint
app.post('/api/reset-demo-balance', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const account = demoAccounts.get(email);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  // Reset to initial $1 billion balance
  account.balance = DEMO_INITIAL_BALANCE;
  account.holdings = {};
  account.transactions = [];

  res.json({
    success: true,
    balance: account.balance,
    message: 'Demo balance reset to $1 billion successfully'
  });
});

// Mock trading endpoint - Buy cryptocurrency
app.post('/api/trade/buy', (req, res) => {
  const { email, crypto, amount, price } = req.body;
  
  if (!email || !crypto || !amount || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const account = demoAccounts.get(email);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const totalCost = amount * price;
  
  if (account.balance < totalCost) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Deduct balance
  account.balance -= totalCost;
  
  // Add to holdings
  if (!account.holdings[crypto]) {
    account.holdings[crypto] = 0;
  }
  account.holdings[crypto] += amount;

  // Record transaction
  account.transactions.push({
    type: 'buy',
    crypto,
    amount,
    price,
    totalCost,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    balance: account.balance,
    holdings: account.holdings,
    message: `Successfully bought ${amount} ${crypto}`
  });
});

// Mock trading endpoint - Sell cryptocurrency
app.post('/api/trade/sell', (req, res) => {
  const { email, crypto, amount, price } = req.body;
  
  if (!email || !crypto || !amount || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const account = demoAccounts.get(email);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (!account.holdings[crypto] || account.holdings[crypto] < amount) {
    return res.status(400).json({ error: 'Insufficient holdings' });
  }

  const totalValue = amount * price;
  
  // Add to balance
  account.balance += totalValue;
  
  // Deduct from holdings
  account.holdings[crypto] -= amount;
  if (account.holdings[crypto] === 0) {
    delete account.holdings[crypto];
  }

  // Record transaction
  account.transactions.push({
    type: 'sell',
    crypto,
    amount,
    price,
    totalValue,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    balance: account.balance,
    holdings: account.holdings,
    message: `Successfully sold ${amount} ${crypto}`
  });
});

// Get transaction history
app.get('/api/transactions', (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const account = demoAccounts.get(email);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json({
    transactions: account.transactions
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`JuicyCryptoMarket server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the platform`);
});

// Export for testing
module.exports = { app, server, DEMO_INITIAL_BALANCE };
