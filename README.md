# JuicyCryptoMarket.com

A full-featured cryptocurrency trading platform with real-time market data, user authentication, and trading functionality.

## 🚀 Features

- **Real-time Market Data**: Live cryptocurrency prices from CoinGecko API
- **User Authentication**: Secure registration and login with JWT tokens
- **Trading Platform**: Buy and sell cryptocurrencies with a user-friendly interface
- **Account Management**: User profiles and transaction history
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Security**: Password hashing, input validation, and secure session management

## 📋 Requirements

- Node.js 14.x or higher
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Laymanlin/JuicyCryptoMarket.com.git
cd JuicyCryptoMarket.com
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration (optional for development):
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret-key
```

## 🚀 Running the Application

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

### Production Mode
```bash
NODE_ENV=production npm start
```

## 📁 Project Structure

```
JuicyCryptoMarket.com/
├── public/              # Frontend files
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side JavaScript
│   ├── index.html      # Landing page
│   ├── trade.html      # Trading interface
│   ├── login.html      # Login page
│   ├── register.html   # Registration page
│   └── profile.html    # User profile page
├── backend/            # Backend files
│   ├── routes/         # API routes
│   │   ├── auth.js     # Authentication routes
│   │   ├── market.js   # Market data routes
│   │   └── trading.js  # Trading routes
│   ├── models/         # Database models
│   │   └── database.js # SQLite database setup
│   └── middleware/     # Custom middleware
│       └── auth.js     # JWT authentication
├── config/             # Configuration files
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
└── README.md          # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Market Data
- `GET /api/market/prices` - Get top cryptocurrency prices
- `GET /api/market/crypto/:id` - Get specific cryptocurrency data

### Trading
- `POST /api/trading/order` - Place a buy/sell order (protected)
- `GET /api/trading/orders` - Get user's orders (protected)
- `GET /api/trading/order/:id` - Get specific order (protected)

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Validates and sanitizes all user inputs
- **SQL Injection Prevention**: Uses parameterized queries
- **XSS Protection**: Sanitizes HTML inputs
- **Secure Sessions**: HTTP-only cookies with secure flag in production
- **Rate Limiting**: Prevents brute-force attacks on authentication (5 attempts per 15 minutes)
- **API Rate Limiting**: General API rate limiting (100 requests per 15 minutes)
- **Environment Security**: Enforces secure secrets in production mode

### Production Security Checklist

Before deploying to production, ensure:
1. Set `NODE_ENV=production`
2. Set unique `JWT_SECRET` environment variable
3. Set unique `SESSION_SECRET` environment variable
4. Enable HTTPS/TLS
5. Configure proper CORS origins
6. Review and adjust rate limiting thresholds
7. Consider implementing CSRF protection for session-based routes
8. Set up proper database backups
9. Enable logging and monitoring

## 🗄️ Database

The application uses SQLite for data storage with the following tables:

- **users**: User account information
- **orders**: Trading orders and transaction history

Database file: `crypto_market.db`

## 🌐 Deployment

### GitHub Pages (Frontend Only)
For static hosting, you can deploy the frontend to GitHub Pages:

```bash
# Build and deploy (requires additional configuration)
```

### Heroku (Full Stack)
1. Create a Heroku app
2. Add environment variables in Heroku dashboard
3. Deploy:
```bash
git push heroku main
```

### Vercel (Full Stack)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Configure environment variables in Vercel dashboard

### Other Platforms
The application can be deployed to any Node.js hosting platform (Railway, Render, DigitalOcean, AWS, etc.)

## 🧪 Testing

To run tests:
```bash
npm test
```

## 📝 Usage

1. **Register**: Create a new account at `/register.html`
2. **Login**: Sign in at `/login.html`
3. **View Markets**: See live cryptocurrency prices on the home page
4. **Trade**: Go to `/trade.html` to place buy/sell orders
5. **Profile**: Check your transaction history at `/profile.html`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is an educational project. Cryptocurrency trading involves risk. This platform is for demonstration purposes and should not be used with real funds without proper security audits and regulatory compliance.

## 🙏 Acknowledgments

- Market data provided by [CoinGecko API](https://www.coingecko.com/en/api)
- Built with Express.js, SQLite, and vanilla JavaScript

## 📞 Support

For issues and questions, please open an issue on GitHub.

