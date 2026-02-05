const express = require('express');
const { orderOperations } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All trading routes require authentication
router.use(authenticateToken);

// Input validation helpers
function validateOrderType(type) {
    return type === 'buy' || type === 'sell';
}

function validateAmount(amount) {
    return !isNaN(amount) && amount > 0;
}

function validatePrice(price) {
    return !isNaN(price) && price > 0;
}

function validateCryptocurrency(crypto) {
    const validCryptos = ['bitcoin', 'ethereum', 'cardano', 'solana', 'ripple'];
    return validCryptos.includes(crypto);
}

// Place a new order
router.post('/order', async (req, res) => {
    try {
        const { type, cryptocurrency, amount, price } = req.body;
        const userId = req.user.userId;

        // Validate inputs
        if (!type || !cryptocurrency || !amount || !price) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!validateOrderType(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order type. Must be "buy" or "sell"'
            });
        }

        if (!validateCryptocurrency(cryptocurrency)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid cryptocurrency'
            });
        }

        if (!validateAmount(amount)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount. Must be a positive number'
            });
        }

        if (!validatePrice(price)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price. Must be a positive number'
            });
        }

        // Create order
        orderOperations.create(
            userId,
            type,
            cryptocurrency,
            parseFloat(amount),
            parseFloat(price),
            (err, orderId) => {
                if (err) {
                    console.error('Error creating order:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create order'
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Order placed successfully',
                    orderId: orderId,
                    order: {
                        id: orderId,
                        type,
                        cryptocurrency,
                        amount: parseFloat(amount),
                        price: parseFloat(price),
                        total: parseFloat(amount) * parseFloat(price),
                        status: 'completed'
                    }
                });
            }
        );
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get user's orders
router.get('/orders', (req, res) => {
    try {
        const userId = req.user.userId;

        orderOperations.findByUserId(userId, (err, orders) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch orders'
                });
            }

            res.json({
                success: true,
                orders: orders || []
            });
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get specific order
router.get('/order/:id', (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        orderOperations.findById(id, (err, order) => {
            if (err) {
                console.error('Error fetching order:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch order'
                });
            }

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Verify order belongs to user
            if (order.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                order: order
            });
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
