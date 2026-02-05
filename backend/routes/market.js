const express = require('express');
const axios = require('axios');

const router = express.Router();

// CoinGecko API base URL (free tier, no API key required)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Mock data for demonstration when API is unavailable
const MOCK_MARKET_DATA = [
    {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45000.00,
        market_cap: 880000000000,
        price_change_percentage_24h: 2.5
    },
    {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2500.00,
        market_cap: 300000000000,
        price_change_percentage_24h: -1.2
    },
    {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
        current_price: 0.50,
        market_cap: 17500000000,
        price_change_percentage_24h: 3.8
    },
    {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        current_price: 100.00,
        market_cap: 43000000000,
        price_change_percentage_24h: -0.5
    },
    {
        id: 'ripple',
        symbol: 'xrp',
        name: 'Ripple',
        current_price: 0.60,
        market_cap: 32000000000,
        price_change_percentage_24h: 1.8
    }
];

// Cache for market data (to reduce API calls)
let marketDataCache = {
    data: null,
    timestamp: null,
    ttl: 60000 // 1 minute cache
};

// Get cryptocurrency prices
router.get('/prices', async (req, res) => {
    try {
        // Check cache
        const now = Date.now();
        if (marketDataCache.data && (now - marketDataCache.timestamp < marketDataCache.ttl)) {
            return res.json({
                success: true,
                data: marketDataCache.data,
                cached: true
            });
        }

        // Try to fetch from CoinGecko API
        try {
            const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
                    page: 1,
                    sparkline: false,
                    price_change_percentage: '24h'
                },
                timeout: 5000
            });

            // Update cache
            marketDataCache.data = response.data;
            marketDataCache.timestamp = now;

            return res.json({
                success: true,
                data: response.data,
                cached: false
            });
        } catch (apiError) {
            // If API call fails, use mock data
            console.log('Using mock data due to API unavailability');
            marketDataCache.data = MOCK_MARKET_DATA;
            marketDataCache.timestamp = now;

            return res.json({
                success: true,
                data: MOCK_MARKET_DATA,
                cached: false,
                mock: true
            });
        }
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        
        // Return mock data as fallback
        res.json({
            success: true,
            data: MOCK_MARKET_DATA,
            mock: true,
            warning: 'Using mock data'
        });
    }
});

// Get specific cryptocurrency data
router.get('/crypto/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Try to fetch from API
        try {
            const response = await axios.get(`${COINGECKO_API}/coins/${id}`, {
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false
                },
                timeout: 5000
            });

            return res.json({
                success: true,
                data: {
                    id: response.data.id,
                    name: response.data.name,
                    symbol: response.data.symbol,
                    current_price: response.data.market_data.current_price.usd,
                    market_cap: response.data.market_data.market_cap.usd,
                    price_change_24h: response.data.market_data.price_change_percentage_24h
                }
            });
        } catch (apiError) {
            // Fallback to mock data
            const mockCrypto = MOCK_MARKET_DATA.find(c => c.id === id);
            if (mockCrypto) {
                return res.json({
                    success: true,
                    data: mockCrypto,
                    mock: true
                });
            }
            throw new Error('Cryptocurrency not found');
        }
    } catch (error) {
        console.error('Error fetching crypto data:', error.message);
        res.status(404).json({
            success: false,
            message: 'Failed to fetch cryptocurrency data',
            error: error.message
        });
    }
});

module.exports = router;
