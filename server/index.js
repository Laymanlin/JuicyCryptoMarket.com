require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const demoRoutes = require('./routes/demo');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection with graceful fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/juicycrypto';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch((err) => {
    console.warn('⚠ MongoDB connection failed (demo mode will still work):', err.message);
  });

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(generalLimiter);
app.use(session({
  secret: process.env.SESSION_SECRET || 'juicy-crypto-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes); // JWT authentication routes
app.use('/api', demoRoutes); // Demo account routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'JuicyCryptoMarket API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
