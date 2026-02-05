const request = require('supertest');
const { app, server, DEMO_INITIAL_BALANCE } = require('./server');

// Close server after all tests
afterAll((done) => {
  server.close(done);
});

describe('Demo Account API Tests', () => {
  const testEmail = 'test@demo.com';

  describe('POST /api/demo-login', () => {
    test('should create demo account with $1 billion balance', async () => {
      const response = await request(app)
        .post('/api/demo-login')
        .send({ email: testEmail })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.account).toBeDefined();
      expect(response.body.account.email).toBe(testEmail);
      expect(response.body.account.balance).toBe(DEMO_INITIAL_BALANCE);
      expect(response.body.account.balance).toBe(1000000000); // $1 billion
      expect(response.body.account.isDemo).toBe(true);
      expect(response.body.account.holdings).toBeDefined();
      expect(response.body.message).toContain('$1 billion');
    });

    test('should return existing account on subsequent login', async () => {
      // First login
      await request(app)
        .post('/api/demo-login')
        .send({ email: testEmail });

      // Second login
      const response = await request(app)
        .post('/api/demo-login')
        .send({ email: testEmail })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.account.email).toBe(testEmail);
    });

    test('should return error if email is missing', async () => {
      const response = await request(app)
        .post('/api/demo-login')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Email is required');
    });
  });

  describe('GET /api/get-balance', () => {
    test('should return account balance', async () => {
      // Create account first
      await request(app)
        .post('/api/demo-login')
        .send({ email: 'balance-test@demo.com' });

      const response = await request(app)
        .get('/api/get-balance')
        .query({ email: 'balance-test@demo.com' })
        .expect(200);

      expect(response.body.balance).toBe(DEMO_INITIAL_BALANCE);
      expect(response.body.holdings).toBeDefined();
    });

    test('should return error if account not found', async () => {
      const response = await request(app)
        .get('/api/get-balance')
        .query({ email: 'nonexistent@demo.com' })
        .expect(404);

      expect(response.body.error).toBe('Account not found');
    });
  });

  describe('POST /api/reset-demo-balance', () => {
    test('should reset balance to $1 billion', async () => {
      const resetEmail = 'reset-test@demo.com';
      
      // Create account
      await request(app)
        .post('/api/demo-login')
        .send({ email: resetEmail });

      // Make a trade to change balance
      await request(app)
        .post('/api/trade/buy')
        .send({
          email: resetEmail,
          crypto: 'BTC',
          amount: 1,
          price: 50000
        });

      // Verify balance changed
      let balance = await request(app)
        .get('/api/get-balance')
        .query({ email: resetEmail });
      
      expect(balance.body.balance).toBeLessThan(DEMO_INITIAL_BALANCE);

      // Reset balance
      const response = await request(app)
        .post('/api/reset-demo-balance')
        .send({ email: resetEmail })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.balance).toBe(DEMO_INITIAL_BALANCE);
      expect(response.body.balance).toBe(1000000000);
      expect(response.body.message).toContain('$1 billion');
    });

    test('should clear holdings when resetting', async () => {
      const clearEmail = 'clear-test@demo.com';
      
      // Create account and buy crypto
      await request(app)
        .post('/api/demo-login')
        .send({ email: clearEmail });

      await request(app)
        .post('/api/trade/buy')
        .send({
          email: clearEmail,
          crypto: 'ETH',
          amount: 10,
          price: 3000
        });

      // Reset balance
      await request(app)
        .post('/api/reset-demo-balance')
        .send({ email: clearEmail });

      // Verify holdings cleared
      const balance = await request(app)
        .get('/api/get-balance')
        .query({ email: clearEmail });

      expect(Object.keys(balance.body.holdings).length).toBe(0);
    });

    test('should return error if account not found', async () => {
      const response = await request(app)
        .post('/api/reset-demo-balance')
        .send({ email: 'nonexistent@demo.com' })
        .expect(404);

      expect(response.body.error).toBe('Account not found');
    });
  });

  describe('POST /api/trade/buy', () => {
    test('should successfully buy cryptocurrency', async () => {
      const tradeEmail = 'trade-buy@demo.com';
      
      await request(app)
        .post('/api/demo-login')
        .send({ email: tradeEmail });

      const response = await request(app)
        .post('/api/trade/buy')
        .send({
          email: tradeEmail,
          crypto: 'BTC',
          amount: 2,
          price: 45000
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.balance).toBe(DEMO_INITIAL_BALANCE - (2 * 45000));
      expect(response.body.holdings.BTC).toBe(2);
    });

    test('should return error if insufficient balance', async () => {
      const poorEmail = 'poor@demo.com';
      
      await request(app)
        .post('/api/demo-login')
        .send({ email: poorEmail });

      const response = await request(app)
        .post('/api/trade/buy')
        .send({
          email: poorEmail,
          crypto: 'BTC',
          amount: 100000000, // Way too much
          price: 50000
        })
        .expect(400);

      expect(response.body.error).toBe('Insufficient balance');
    });
  });

  describe('POST /api/trade/sell', () => {
    test('should successfully sell cryptocurrency', async () => {
      const sellEmail = 'trade-sell@demo.com';
      
      await request(app)
        .post('/api/demo-login')
        .send({ email: sellEmail });

      // Buy first
      await request(app)
        .post('/api/trade/buy')
        .send({
          email: sellEmail,
          crypto: 'ETH',
          amount: 5,
          price: 3000
        });

      // Then sell
      const response = await request(app)
        .post('/api/trade/sell')
        .send({
          email: sellEmail,
          crypto: 'ETH',
          amount: 3,
          price: 3100
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.holdings.ETH).toBe(2);
    });

    test('should return error if insufficient holdings', async () => {
      const noHoldingsEmail = 'no-holdings@demo.com';
      
      await request(app)
        .post('/api/demo-login')
        .send({ email: noHoldingsEmail });

      const response = await request(app)
        .post('/api/trade/sell')
        .send({
          email: noHoldingsEmail,
          crypto: 'BTC',
          amount: 1,
          price: 50000
        })
        .expect(400);

      expect(response.body.error).toBe('Insufficient holdings');
    });
  });

  describe('GET /api/transactions', () => {
    test('should return transaction history', async () => {
      const txEmail = 'transactions@demo.com';
      
      await request(app)
        .post('/api/demo-login')
        .send({ email: txEmail });

      // Make some trades
      await request(app)
        .post('/api/trade/buy')
        .send({
          email: txEmail,
          crypto: 'BTC',
          amount: 1,
          price: 50000
        });

      const response = await request(app)
        .get('/api/transactions')
        .query({ email: txEmail })
        .expect(200);

      expect(response.body.transactions).toBeDefined();
      expect(response.body.transactions.length).toBeGreaterThan(0);
      expect(response.body.transactions[0].type).toBe('buy');
      expect(response.body.transactions[0].crypto).toBe('BTC');
    });
  });

  describe('High-value trading capability', () => {
    test('should support trading with large amounts using $1B balance', async () => {
      const whaleEmail = 'whale@demo.com';
      
      await request(app)
        .post('/api/demo-login')
        .send({ email: whaleEmail });

      // Buy a massive amount - $100 million worth of BTC
      const response = await request(app)
        .post('/api/trade/buy')
        .send({
          email: whaleEmail,
          crypto: 'BTC',
          amount: 2000,
          price: 50000
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.holdings.BTC).toBe(2000);
      
      // Should still have plenty of balance left
      expect(response.body.balance).toBeGreaterThan(800000000); // At least $800M left
    });
  });
});
