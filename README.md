# JuicyCryptoMarket.com

JuicyCryptoMarket.com is a cutting-edge cryptocurrency broker platform designed to simplify buying, selling, and managing cryptocurrencies.

## Features
- Real-time cryptocurrency prices and market data.
- **🎮 Demo Account**: Try the platform risk-free with $10,000 in virtual funds!
- Secure account creation and login using email and password.
- User-friendly interface for trading and managing assets.
- Integration with leading cryptocurrency APIs for live trading.

## Demo Account Feature

The demo account allows users to explore the platform without using real money, providing a risk-free way to try the app.

### Demo Account Benefits:
- ✅ **No signup required** - Instant access with one click
- ✅ **$10,000 virtual funds** - Plenty of demo money to practice trading
- ✅ **Full trading features** - Experience all platform capabilities
- ✅ **Risk-free environment** - No real money involved
- ✅ **Automatic reset** - Demo account resets after logout

### How to Use Demo Account:
1. Visit the login page
2. Click the "🎮 Login as Demo Account" button
3. Start trading immediately with virtual funds!

### Demo Account Security:
- Demo accounts are isolated from real user data
- No access to sensitive information
- Cannot execute real transactions through external APIs
- Sessions expire after 24 hours
- Data is cleared upon logout

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Laymanlin/JuicyCryptoMarket.com.git
   cd JuicyCryptoMarket.com
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3001`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Running Tests

Run the test suite to verify all features:

```bash
npm test
```

This will run:
- API endpoint tests
- Demo account functionality tests
- Trade execution tests
- Session management tests

## API Endpoints

### Demo Account API

#### POST `/api/demo-login`
Creates a new demo account with virtual funds.

**Response:**
```json
{
  "success": true,
  "message": "Demo account created successfully",
  "account": {
    "id": "demo_xxx",
    "username": "demo_user",
    "email": "demo@juicycryptomarket.com",
    "isDemo": true,
    "wallet": {
      "balance": 10000,
      "currency": "USD",
      "assets": []
    }
  }
}
```

#### GET `/api/account`
Get current account information.

#### POST `/api/trade`
Execute a trade (buy/sell cryptocurrency).

**Request Body:**
```json
{
  "type": "buy",
  "cryptocurrency": "BTC",
  "amount": 0.1,
  "price": 45000
}
```

#### POST `/api/logout`
Logout and clear session data.

#### GET `/api/market-prices`
Get current cryptocurrency market prices.

## Project Structure

```
JuicyCryptoMarket.com/
├── frontend/              # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   │   ├── Login.js      # Login page with demo button
│   │   │   └── Dashboard.js  # Trading dashboard
│   │   ├── App.js        # Main app component
│   │   └── App.css       # Styles
│   └── package.json
├── server/               # Express backend
│   ├── routes/          # API routes
│   │   └── demo.js      # Demo account endpoints
│   ├── utils/           # Utility functions
│   │   └── demoAccount.js  # Demo account logic
│   └── index.js         # Server entry point
├── tests/               # Test files
│   ├── demo.test.js     # API tests
│   └── demoAccount.test.js  # Utils tests
├── package.json
├── jest.config.js
└── README.md
```

## Development

### Running in Development Mode

For backend auto-reload on changes:
```bash
npm run dev
```

For frontend with backend proxy:
```bash
cd frontend && npm start
```

### Building for Production

Build the frontend:
```bash
npm run build
```

## Technology Stack

- **Frontend**: React 18
- **Backend**: Node.js, Express
- **Session Management**: express-session
- **Testing**: Jest, Supertest
- **Security**: CORS, session isolation

## Future Enhancements
- Advanced trading tools and analytics.
- Support for multiple languages.
- Enhanced API integrations.
- Real user authentication and registration.
- Persistent database storage.
- Real-time WebSocket price updates.

## Contributing
We welcome contributions! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
This project is licensed under the terms of the Mozilla Public License 2.0. See [LICENSE](LICENSE) for details.

---

Start exploring the crypto world today with **JuicyCryptoMarket.com!** 🥤💰

Try our **Demo Account** - No signup required, just click and trade!