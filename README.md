# JuicyCryptoMarket.com

JuicyCryptoMarket.com is a cutting-edge cryptocurrency broker platform designed to simplify buying, selling, and managing cryptocurrencies.

## Features

- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 🎮 **Demo Account**: Try the platform risk-free with $10,000 in virtual funds!
- 💾 **MongoDB Integration**: Secure user data storage
- 🛡️ **Security Features**: Rate limiting, bcrypt password hashing, CORS protection
- 📊 **Real-time Market Data**: Live cryptocurrency prices
- 💱 **Trading Features**: Buy and sell cryptocurrencies
- 🎨 **Modern UI**: Clean, responsive React interface

## Authentication System

### User Registration & Login

Create a real account to save your trading history and preferences:

#### Registration Benefits:
- ✅ **Persistent Account** - Your data is saved securely
- ✅ **JWT Authentication** - Industry-standard security
- ✅ **Password Protection** - Bcrypt hashing for security
- ✅ **Email-based Login** - Easy to remember credentials
- ✅ **Rate Limiting** - Protection against brute force attacks

#### How to Register:
1. Click "Need an account? Register"
2. Enter your email and password (minimum 6 characters)
3. Confirm your password
4. Click "Register"
5. You'll be automatically logged in

#### How to Login:
1. Enter your registered email and password
2. Click "Login"
3. Access your dashboard with saved data

### Security Features

- **JWT Tokens**: 7-day expiration, secure token-based authentication
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Rate Limiting**: 5 authentication attempts per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Secure Sessions**: HTTPOnly cookies for demo accounts
- **Input Validation**: Both client-side and server-side validation

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
- MongoDB (local installation or MongoDB Atlas account)

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

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```
   # Required for authentication
   JWT_SECRET=your_strong_secret_key_here
   JWT_EXPIRES_IN=7d
   
   # MongoDB connection
   MONGODB_URI=mongodb://localhost:27017/juicycrypto
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/juicycrypto
   
   # Other settings
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   PORT=3001
   ```

4. Start MongoDB (if using local installation):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas (cloud) - no local installation needed
   ```

5. Start the backend server:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```
   The server will run on `http://localhost:3001`
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

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express-session** for demo account sessions
- **Express-rate-limit** for API protection
- **CORS** for cross-origin requests

### Frontend
- **React 18** - Modern UI library
- **Create React App** - Build tooling
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests

## Project Structure

```
JuicyCryptoMarket.com/
├── frontend/                 # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Login.js     # Login/Register page
│   │   │   └── Dashboard.js # Trading dashboard
│   │   ├── config/          # Configuration
│   │   │   └── api.js       # API endpoints
│   │   ├── App.js           # Main app component
│   │   └── App.css          # Styles
│   └── package.json
├── server/                  # Express backend
│   ├── models/             # Database models
│   │   └── User.js         # User model with auth
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   └── demo.js         # Demo account routes
│   ├── utils/              # Utility functions
│   └── index.js            # Server entry point
├── tests/                  # Test files
├── DEPLOYMENT.md          # Deployment guide
├── .env.example           # Environment variables template
├── Procfile              # For Heroku/Render deployment
├── netlify.toml          # Netlify configuration
└── package.json
```

## API Endpoints

### Authentication Routes

#### POST `/api/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### GET `/api/auth/verify`
Verify JWT token validity.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

## Running Tests

Run the test suite to verify all features:

```bash
npm test
```

This will run:
- API endpoint tests  
- Demo account functionality tests
- Authentication tests
- Trade execution tests
- Session management tests

## Deployment

For detailed deployment instructions to production environments, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Summary

1. **MongoDB Atlas** - Set up free cloud database
2. **Render/Heroku** - Deploy backend with environment variables
3. **Netlify** - Deploy frontend with API URL configuration

See the full [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions.

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
cd frontend && npm run build
```

## Security Considerations

### Production Security Checklist

- ✅ **JWT Secret**: Use strong random secret (64+ characters)
- ✅ **MongoDB URI**: Never expose in frontend code
- ✅ **CORS**: Restrict ALLOWED_ORIGINS to your domains
- ✅ **HTTPS**: Always use HTTPS in production
- ✅ **Rate Limiting**: Already implemented (5 auth attempts/15 min)
- ✅ **Password Hashing**: Bcrypt with 10 rounds
- ✅ **Input Validation**: Client and server-side validation

### Current Security Features

- JWT authentication with 7-day expiration
- Bcrypt password hashing
- Rate limiting on authentication endpoints
- CORS protection with configurable origins
- Session management with HTTPOnly cookies for demo accounts
- Input validation on all endpoints
- Demo accounts isolated from real user data

## Future Enhancements

- [ ] Real-time WebSocket price updates
- [ ] Advanced trading tools and analytics
- [ ] Support for multiple languages
- [ ] Enhanced API integrations with live exchanges
- [ ] Two-factor authentication (2FA)
- [ ] Password reset functionality
- [ ] Email verification for new accounts
- [ ] Trading history and analytics dashboard

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the Mozilla Public License 2.0. See [LICENSE](LICENSE) for details.

---

Start exploring the crypto world today with **JuicyCryptoMarket.com!** 🥤💰

**Two ways to get started:**
- 🎮 **Demo Account** - No signup required, instant access with $10,000 virtual funds
- 🔐 **Real Account** - Register to save your data and trading history