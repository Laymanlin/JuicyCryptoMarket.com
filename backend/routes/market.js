const express = require('express');
const axios = require('axios');

const router = express.Router();

// CoinGecko API base URL (free tier, no API key required)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

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

        // Fetch from CoinGecko API
        const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            },
            timeout: 10000
        });

        // Update cache
        marketDataCache.data = response.data;
        marketDataCache.timestamp = now;

        res.json({
            success: true,
            data: response.data,
            cached: false
        });
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        
        // If we have cached data, return it even if expired
        if (marketDataCache.data) {
            return res.json({
                success: true,
                data: marketDataCache.data,
                cached: true,
                warning: 'Using cached data due to API error'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch market data',
            error: error.message
        });
    }
});

// Get specific cryptocurrency data
router.get('/crypto/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(`${COINGECKO_API}/coins/${id}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false
            },
            timeout: 10000
        });

        res.json({
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
    } catch (error) {
        console.error('Error fetching crypto data:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cryptocurrency data',
            error: error.message
        });
    }
});

module.exports = router;
