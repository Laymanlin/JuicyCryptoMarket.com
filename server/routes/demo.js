const express = require('express');
const router = express.Router();
const {
  generateDemoAccount,
  isDemoAccount,
  isDemoAccountExpired,
  executeDemoTrade
} = require('../utils/demoAccount');

// Store active demo sessions (in-memory, will be cleared on server restart)
// In production, consider using Redis or another session store
const demoSessions = new Map();

/**
 * POST /api/demo-login
 * Generate and return a demo account
 */
router.post('/demo-login', (req, res) => {
  try {
    // Generate new demo account
    const demoAccount = generateDemoAccount();
    
    // Store in session
    req.session.account = demoAccount;
    demoSessions.set(demoAccount.id, demoAccount);

    // Return account info (excluding sensitive data)
    res.json({
      success: true,
      message: 'Demo account created successfully',
      account: {
        id: demoAccount.id,
        username: demoAccount.username,
        email: demoAccount.email,
        isDemo: demoAccount.isDemo,
        wallet: demoAccount.wallet,
        createdAt: demoAccount.createdAt,
        expiresAt: demoAccount.expiresAt
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create demo account',
      error: error.message
    });
  }
});

/**
 * GET /api/account
 * Get current account information
 */
router.get('/account', (req, res) => {
  try {
    const account = req.session.account;

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Not logged in'
      });
    }

    // Check if demo account expired
    if (isDemoAccount(account) && isDemoAccountExpired(account)) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Demo session expired'
      });
    }

    res.json({
      success: true,
      account: {
        id: account.id,
        username: account.username,
        email: account.email,
        isDemo: account.isDemo,
        wallet: account.wallet,
        trades: account.trades
      }
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get account information',
      error: error.message
    });
  }
});

/**
 * POST /api/trade
 * Execute a trade (demo only for now)
 */
router.post('/trade', (req, res) => {
  try {
    const account = req.session.account;

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Not logged in'
      });
    }

    // Only allow demo accounts to trade through this endpoint
    if (!isDemoAccount(account)) {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is only for demo accounts'
      });
    }

    // Check if demo account expired
    if (isDemoAccountExpired(account)) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Demo session expired'
      });
    }

    const { type, cryptocurrency, amount, price } = req.body;

    // Validate input
    if (!type || !cryptocurrency || !amount || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, cryptocurrency, amount, price'
      });
    }

    if (!['buy', 'sell'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trade type. Must be "buy" or "sell"'
      });
    }

    // Execute demo trade
    const trade = executeDemoTrade(account, {
      type,
      cryptocurrency,
      amount: parseFloat(amount),
      price: parseFloat(price)
    });

    // Update session
    req.session.account = account;
    demoSessions.set(account.id, account);

    res.json({
      success: true,
      message: 'Trade executed successfully',
      trade,
      wallet: account.wallet
    });
  } catch (error) {
    console.error('Trade execution error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/logout
 * Logout and clear session
 */
router.post('/logout', (req, res) => {
  try {
    const account = req.session.account;

    if (account && isDemoAccount(account)) {
      // Remove from demo sessions
      demoSessions.delete(account.id);
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to logout'
        });
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: error.message
    });
  }
});

/**
 * GET /api/market-prices
 * Get mock cryptocurrency prices for demo
 */
router.get('/market-prices', (req, res) => {
  try {
    // Mock prices for demo purposes
    // In production, fetch from real crypto API
    const mockPrices = {
      BTC: 45000 + Math.random() * 1000,
      ETH: 3000 + Math.random() * 100,
      BNB: 400 + Math.random() * 20,
      ADA: 0.5 + Math.random() * 0.1,
      SOL: 100 + Math.random() * 10
    };

    res.json({
      success: true,
      prices: mockPrices,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices',
      error: error.message
    });
  }
});

module.exports = router;
