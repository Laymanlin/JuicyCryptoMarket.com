const express = require('express');
const cors = require('cors');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Ensure secrets are set in production
if (process.env.NODE_ENV === 'production') {
    if (!process.env.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable must be set in production');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable must be set in production');
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Warn if using default secrets in development
if (!process.env.SESSION_SECRET && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Warning: Using default SESSION_SECRET. Set SESSION_SECRET environment variable for production.');
}

// Rate limiting for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Too many authentication attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
// Note: For production, consider implementing CSRF protection with a modern approach
// such as SameSite cookies and custom headers
app.use(session({
    secret: process.env.SESSION_SECRET || 'juicy-crypto-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
const db = require('./backend/models/database');
db.initializeDatabase();

// API Routes
const authRoutes = require('./backend/routes/auth');
const marketRoutes = require('./backend/routes/market');
const tradingRoutes = require('./backend/routes/trading');

// Apply rate limiting to authentication routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trading', tradingRoutes);

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🍊 Juicy Crypto Market server running on port ${PORT}`);
    console.log(`📊 Access the platform at http://localhost:${PORT}`);
});

module.exports = app;
