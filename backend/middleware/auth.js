const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'juicy-crypto-jwt-secret-change-in-production';

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
