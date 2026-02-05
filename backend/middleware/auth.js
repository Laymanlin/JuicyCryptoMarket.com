const jwt = require('jsonwebtoken');

// Ensure JWT secret is set in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable must be set in production');
}

const JWT_SECRET = process.env.JWT_SECRET || 'juicy-crypto-jwt-secret-change-in-production';

// Warn if using default secret in development
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Warning: Using default JWT_SECRET. Set JWT_SECRET environment variable for production.');
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
    JWT_SECRET
};
