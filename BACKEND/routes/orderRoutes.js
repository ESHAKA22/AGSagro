const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');

// POST /api/orders - Endpoint to place an order
router.post('/', async (req, res) => {
    try {
        const { customerId, cart, shippingDetails } = req.body;

        if (!customerId || !cart || !cart.length || !shippingDetails) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new order
        const newOrder = new Order({
            customerId,
            cart,
            shippingDetails,
            status: 'pending',
            createdAt: new Date(),
        });

        await newOrder.save();
        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

module.exports = router;
