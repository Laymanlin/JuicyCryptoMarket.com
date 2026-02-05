const {
  generateDemoAccount,
  isDemoAccount,
  isDemoAccountExpired,
  executeDemoTrade,
  DEMO_CONFIG
} = require('../server/utils/demoAccount');

describe('Demo Account Utils Tests', () => {
  describe('generateDemoAccount', () => {
    it('should generate a valid demo account', () => {
      const account = generateDemoAccount();

      expect(account).toBeDefined();
      expect(account.id).toMatch(/^demo_/);
      expect(account.username).toBe('demo_user');
      expect(account.isDemo).toBe(true);
      expect(account.wallet.balance).toBe(DEMO_CONFIG.INITIAL_BALANCE);
      expect(account.wallet.currency).toBe(DEMO_CONFIG.CURRENCY);
      expect(Array.isArray(account.wallet.assets)).toBe(true);
      expect(Array.isArray(account.trades)).toBe(true);
    });

    it('should generate unique account IDs', () => {
      const account1 = generateDemoAccount();
      const account2 = generateDemoAccount();

      expect(account1.id).not.toBe(account2.id);
    });
  });

  describe('isDemoAccount', () => {
    it('should identify a demo account', () => {
      const account = generateDemoAccount();
      expect(isDemoAccount(account)).toBe(true);
    });

    it('should reject non-demo account', () => {
      const account = {
        id: 'user_123',
        isDemo: false
      };
      expect(isDemoAccount(account)).toBe(false);
    });

    it('should reject invalid account', () => {
      expect(isDemoAccount(null)).toBe(false);
      expect(isDemoAccount(undefined)).toBe(false);
      expect(isDemoAccount({})).toBe(false);
    });
  });

  describe('isDemoAccountExpired', () => {
    it('should detect expired account', () => {
      const account = {
        expiresAt: Date.now() - 1000 // Expired 1 second ago
      };
      expect(isDemoAccountExpired(account)).toBe(true);
    });

    it('should detect non-expired account', () => {
      const account = {
        expiresAt: Date.now() + 1000000 // Expires in future
      };
      expect(isDemoAccountExpired(account)).toBe(false);
    });

    it('should handle invalid account', () => {
      expect(isDemoAccountExpired(null)).toBe(true);
      expect(isDemoAccountExpired(undefined)).toBe(true);
      expect(isDemoAccountExpired({})).toBe(true);
    });
  });

  describe('executeDemoTrade', () => {
    let account;

    beforeEach(() => {
      account = generateDemoAccount();
    });

    it('should execute buy trade successfully', () => {
      const trade = {
        type: 'buy',
        cryptocurrency: 'BTC',
        amount: 0.1,
        price: 45000
      };

      const result = executeDemoTrade(account, trade);

      expect(result).toBeDefined();
      expect(result.type).toBe('buy');
      expect(result.cryptocurrency).toBe('BTC');
      expect(account.wallet.balance).toBe(10000 - (0.1 * 45000));
      expect(account.wallet.assets.length).toBe(1);
      expect(account.wallet.assets[0].symbol).toBe('BTC');
      expect(account.wallet.assets[0].amount).toBe(0.1);
      expect(account.trades.length).toBe(1);
    });

    it('should execute sell trade successfully', () => {
      // First buy
      executeDemoTrade(account, {
        type: 'buy',
        cryptocurrency: 'BTC',
        amount: 0.1,
        price: 45000
      });

      // Then sell
      const sellTrade = {
        type: 'sell',
        cryptocurrency: 'BTC',
        amount: 0.05,
        price: 46000
      };

      const result = executeDemoTrade(account, sellTrade);

      expect(result).toBeDefined();
      expect(result.type).toBe('sell');
      expect(account.wallet.assets[0].amount).toBe(0.05);
    });

    it('should throw error for non-demo account', () => {
      const regularAccount = {
        id: 'user_123',
        isDemo: false
      };

      expect(() => {
        executeDemoTrade(regularAccount, {
          type: 'buy',
          cryptocurrency: 'BTC',
          amount: 0.1,
          price: 45000
        });
      }).toThrow('Not a demo account');
    });

    it('should throw error for insufficient funds', () => {
      expect(() => {
        executeDemoTrade(account, {
          type: 'buy',
          cryptocurrency: 'BTC',
          amount: 1000,
          price: 45000
        });
      }).toThrow('Insufficient funds');
    });

    it('should throw error for insufficient holdings', () => {
      expect(() => {
        executeDemoTrade(account, {
          type: 'sell',
          cryptocurrency: 'BTC',
          amount: 1,
          price: 45000
        });
      }).toThrow('Insufficient cryptocurrency holdings');
    });

    it('should accumulate multiple buy trades', () => {
      executeDemoTrade(account, {
        type: 'buy',
        cryptocurrency: 'BTC',
        amount: 0.1,
        price: 45000
      });

      executeDemoTrade(account, {
        type: 'buy',
        cryptocurrency: 'BTC',
        amount: 0.05,
        price: 46000
      });

      expect(account.wallet.assets[0].amount).toBe(0.15);
    });

    it('should remove asset when selling all holdings', () => {
      executeDemoTrade(account, {
        type: 'buy',
        cryptocurrency: 'BTC',
        amount: 0.1,
        price: 45000
      });

      executeDemoTrade(account, {
        type: 'sell',
        cryptocurrency: 'BTC',
        amount: 0.1,
        price: 46000
      });

      expect(account.wallet.assets.length).toBe(0);
    });
  });
});
