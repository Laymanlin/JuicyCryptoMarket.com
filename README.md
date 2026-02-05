# JuicyCryptoMarket.com

JuicyCryptoMarket.com is a cutting-edge cryptocurrency broker platform designed to simplify buying, selling, and managing cryptocurrencies.

## Features
- **$1 Billion Demo Mode**: Experience risk-free trading with $1 billion in demo funds
- Real-time cryptocurrency prices and market data
- Secure demo account login using email
- User-friendly interface for trading and managing assets
- Mock trading capability with high-value transactions
- Reset demo balance functionality to restore $1 billion at any time

## Demo Mode Features

### 🎯 $1 Billion Demo Account
All demo accounts are automatically funded with **$1,000,000,000 (One Billion Dollars)** upon login. This substantial balance allows you to:
- Test platform features without any real-world risk
- Engage in high-value trading scenarios
- Explore cryptocurrency trading strategies
- Learn how to manage large portfolios

### 🔄 Reset Demo Balance
At any time, you can reset your demo account balance back to the initial $1 billion using the "Reset Demo Balance" button on your dashboard. This will:
- Restore your balance to $1,000,000,000
- Clear all current holdings
- Reset transaction history
- Allow you to start fresh with your testing

### 📊 Features Available in Demo Mode
- **Buy/Sell Cryptocurrencies**: Trade Bitcoin, Ethereum, Binance Coin, Cardano, and Solana
- **Portfolio Management**: View your holdings and track your investments
- **Transaction History**: See all your past trades with timestamps
- **Balance Display**: Prominently displayed on your dashboard
- **Real-time Updates**: Balance and holdings update instantly after each trade

## How to Use

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Laymanlin/JuicyCryptoMarket.com.git
   ```
2. Navigate to the project directory:
   ```bash
   cd JuicyCryptoMarket.com
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Using Demo Mode
1. **Login**: Enter any email address on the login page to create/access your demo account
2. **View Balance**: Your dashboard will display your $1 billion demo balance prominently
3. **Start Trading**: Use the trading forms to buy or sell cryptocurrencies
4. **Monitor Portfolio**: View your holdings and transaction history
5. **Reset Anytime**: Click "Reset Demo Balance" to restore your balance to $1 billion

## API Endpoints

### Demo Account Management
- `POST /api/demo-login` - Login to demo account (creates account with $1B balance if new)
- `GET /api/get-balance` - Get current account balance and holdings
- `POST /api/reset-demo-balance` - Reset balance to $1 billion and clear all holdings

### Trading
- `POST /api/trade/buy` - Buy cryptocurrency
- `POST /api/trade/sell` - Sell cryptocurrency
- `GET /api/transactions` - Get transaction history

## Testing

Run the test suite to verify demo account functionality:
```bash
npm test
```

The test suite validates:
- Demo account creation with $1 billion balance
- Balance reset functionality
- Trading operations (buy/sell)
- High-value transaction capability
- Transaction history tracking

## Technology Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: Jest, Supertest
- **Storage**: In-memory (suitable for demo/testing)

## Future Enhancements
- Advanced trading tools and analytics
- Support for multiple languages
- Enhanced API integrations
- Real-time price feeds from live APIs
- Chart visualization for portfolio performance

## Contributing
We welcome contributions! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
This project is licensed under the terms of the [MIT License](LICENSE).

---

**Start exploring the crypto world today with JuicyCryptoMarket.com - No risk, $1 Billion in demo funds!** 💰🚀