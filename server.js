const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// API endpoint for market data (placeholder)
app.get('/api/markets', (req, res) => {
    res.json({
        success: true,
        data: [
            { symbol: 'BTC', name: 'Bitcoin', price: 45230.50, change: 2.5 },
            { symbol: 'ETH', name: 'Ethereum', price: 2890.75, change: 1.8 },
            { symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.0 },
            { symbol: 'BNB', name: 'BNB', price: 325.40, change: -0.5 }
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🍊 JuicyCryptoMarket server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.APP_ENV || 'development'}`);
});
