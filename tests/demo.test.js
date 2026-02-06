const request = require('supertest');
const app = require('../server/index');

describe('Demo Account API Tests', () => {
  let agent;

  beforeEach(() => {
    // Create a new agent for each test to maintain session
    agent = request.agent(app);
  });

  describe('POST /api/demo-login', () => {
    it('should create a demo account successfully', async () => {
      const response = await agent
        .post('/api/demo-login')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Demo account created successfully');
      expect(response.body.account).toBeDefined();
      expect(response.body.account.isDemo).toBe(true);
      expect(response.body.account.id).toMatch(/^demo_/);
      expect(response.body.account.wallet.balance).toBe(10000);
    });

    it('should return demo account with correct structure', async () => {
      const response = await agent
        .post('/api/demo-login')
        .expect(200);

      const account = response.body.account;
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('username');
      expect(account).toHaveProperty('email');
      expect(account).toHaveProperty('isDemo');
      expect(account).toHaveProperty('wallet');
      expect(account).toHaveProperty('createdAt');
      expect(account).toHaveProperty('expiresAt');
      expect(account.wallet).toHaveProperty('balance');
      expect(account.wallet).toHaveProperty('currency');
      expect(account.wallet).toHaveProperty('assets');
    });
  });

  describe('GET /api/account', () => {
    it('should return 401 when not logged in', async () => {
      const response = await agent
        .get('/api/account')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not logged in');
    });

    it('should return account info after demo login', async () => {
      // Login first
      await agent.post('/api/demo-login');

      // Get account info
      const response = await agent
        .get('/api/account')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.account).toBeDefined();
      expect(response.body.account.isDemo).toBe(true);
    });
  });

  describe('POST /api/trade', () => {
    beforeEach(async () => {
      // Login before each trade test
      await agent.post('/api/demo-login');
    });

    it('should execute a buy trade successfully', async () => {
      const response = await agent
        .post('/api/trade')
        .send({
          type: 'buy',
          cryptocurrency: 'BTC',
          amount: 0.1,
          price: 45000
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Trade executed successfully');
      expect(response.body.trade).toBeDefined();
      expect(response.body.trade.type).toBe('buy');
      expect(response.body.wallet.balance).toBeLessThan(10000);
      expect(response.body.wallet.assets.length).toBeGreaterThan(0);
    });

    it('should execute a sell trade successfully', async () => {
      // First buy some BTC
      await agent
        .post('/api/trade')
        .send({
          type: 'buy',
          cryptocurrency: 'BTC',
          amount: 0.1,
          price: 45000
        });

      // Then sell it
      const response = await agent
        .post('/api/trade')
        .send({
          type: 'sell',
          cryptocurrency: 'BTC',
          amount: 0.05,
          price: 45500
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.trade.type).toBe('sell');
    });

    it('should reject trade with insufficient funds', async () => {
      const response = await agent
        .post('/api/trade')
        .send({
          type: 'buy',
          cryptocurrency: 'BTC',
          amount: 1000, // Too expensive
          price: 45000
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient funds');
    });

    it('should reject sell trade with insufficient holdings', async () => {
      const response = await agent
        .post('/api/trade')
        .send({
          type: 'sell',
          cryptocurrency: 'BTC',
          amount: 1,
          price: 45000
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient cryptocurrency holdings');
    });

    it('should reject trade with missing fields', async () => {
      const response = await agent
        .post('/api/trade')
        .send({
          type: 'buy',
          cryptocurrency: 'BTC'
          // Missing amount and price
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should reject trade with invalid type', async () => {
      const response = await agent
        .post('/api/trade')
        .send({
          type: 'invalid',
          cryptocurrency: 'BTC',
          amount: 0.1,
          price: 45000
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid trade type');
    });
  });

  describe('POST /api/logout', () => {
    it('should logout successfully', async () => {
      // Login first
      await agent.post('/api/demo-login');

      // Logout
      const response = await agent
        .post('/api/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');

      // Verify session is cleared
      const accountResponse = await agent
        .get('/api/account')
        .expect(401);

      expect(accountResponse.body.success).toBe(false);
    });
  });

  describe('GET /api/market-prices', () => {
    it('should return market prices', async () => {
      const response = await agent
        .get('/api/market-prices')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.prices).toBeDefined();
      expect(response.body.prices).toHaveProperty('BTC');
      expect(response.body.prices).toHaveProperty('ETH');
      expect(typeof response.body.prices.BTC).toBe('number');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await agent
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });
});
