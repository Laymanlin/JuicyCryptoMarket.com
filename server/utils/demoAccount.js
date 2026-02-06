const { v4: uuidv4 } = require('uuid');

/**
 * Demo account configuration
 */
const DEMO_CONFIG = {
  INITIAL_BALANCE: 10000.00,
  CURRENCY: 'USD',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Generate a demo account with predefined settings
 */
function generateDemoAccount() {
  const accountId = `demo_${uuidv4()}`;
  const timestamp = Date.now();

  return {
    id: accountId,
    username: 'demo_user',
    email: 'demo@juicycryptomarket.com',
    isDemo: true,
    createdAt: timestamp,
    expiresAt: timestamp + DEMO_CONFIG.SESSION_TIMEOUT,
    wallet: {
      balance: DEMO_CONFIG.INITIAL_BALANCE,
      currency: DEMO_CONFIG.CURRENCY,
      assets: []
    },
    trades: []
  };
}

/**
 * Validate that an account is a demo account
 */
function isDemoAccount(account) {
  return account && account.isDemo === true && account.id && account.id.startsWith('demo_');
}

/**
 * Check if demo account has expired
 */
function isDemoAccountExpired(account) {
  if (!account || !account.expiresAt) {
    return true;
  }
  return Date.now() > account.expiresAt;
}

/**
 * Simulate trade execution for demo account
 * This does NOT interact with real APIs
 */
function executeDemoTrade(account, trade) {
  if (!isDemoAccount(account)) {
    throw new Error('Not a demo account');
  }

  const { type, cryptocurrency, amount, price } = trade;
  const totalCost = amount * price;

  // Validate trade
  if (type === 'buy' && account.wallet.balance < totalCost) {
    throw new Error('Insufficient funds');
  }

  if (type === 'sell') {
    const asset = account.wallet.assets.find(a => a.symbol === cryptocurrency);
    if (!asset || asset.amount < amount) {
      throw new Error('Insufficient cryptocurrency holdings');
    }
  }

  // Execute trade (demo only - no real API calls)
  if (type === 'buy') {
    account.wallet.balance -= totalCost;
    const existingAsset = account.wallet.assets.find(a => a.symbol === cryptocurrency);
    
    if (existingAsset) {
      existingAsset.amount += amount;
    } else {
      account.wallet.assets.push({
        symbol: cryptocurrency,
        amount: amount,
        avgPrice: price
      });
    }
  } else if (type === 'sell') {
    account.wallet.balance += totalCost;
    const asset = account.wallet.assets.find(a => a.symbol === cryptocurrency);
    asset.amount -= amount;
    
    // Remove asset if amount is 0
    if (asset.amount === 0) {
      account.wallet.assets = account.wallet.assets.filter(a => a.symbol !== cryptocurrency);
    }
  }

  // Record trade
  const tradeRecord = {
    id: uuidv4(),
    type,
    cryptocurrency,
    amount,
    price,
    totalCost,
    timestamp: Date.now()
  };
  
  account.trades.push(tradeRecord);

  return tradeRecord;
}

module.exports = {
  generateDemoAccount,
  isDemoAccount,
  isDemoAccountExpired,
  executeDemoTrade,
  DEMO_CONFIG
};
