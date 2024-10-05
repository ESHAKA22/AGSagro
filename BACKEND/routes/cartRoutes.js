const express = require('express');
const router = express.Router();
const Cart = require('../models/CartModel'); // Assuming the cart model is in models directory
const Product = require('../models/ProductModel'); // Import Product model for validation

// Middleware to extract cid from cookie
const getCidFromCookie = (req) => {
    const cid = req.cookies.customerId;
    if (!cid) {
        throw new Error('Customer ID not found in cookies.');
    }
    return cid;
};

// Get the current cart for a customer
router.get('/', async (req, res) => { // Changed '/cart' to '/' since '/api/cart' is already prefixed in server.js
    try {
        const cid = getCidFromCookie(req); // Extract cid from cookies
        const cart = await Cart.findOne({ cid, status: 'active' }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add an item to the cart
router.post('/add', async (req, res) => { // Changed '/cart/add' to '/add'
    const { productId, quantity } = req.body;

    try {
        const cid = getCidFromCookie(req); // Extract cid from cookies
        let cart = await Cart.findOne({ cid, status: 'active' });

        // If no active cart exists for the customer, create a new one
        if (!cart) {
            cart = new Cart({ cid, products: [] });
        }

        // Check if the product already exists in the cart
        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (existingProduct) {
            // If it exists, update the quantity
            existingProduct.quantity += quantity;
        } else {
            // Add new product to the cart
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the quantity of an item in the cart
router.put('/update', async (req, res) => { // Changed '/cart/update' to '/update'
    const { productId, quantity } = req.body;

    try {
        const cid = getCidFromCookie(req); // Extract cid from cookies
        const cart = await Cart.findOne({ cid, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart
        const product = cart.products.find(p => p.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update the quantity or remove if quantity is 0
        if (quantity <= 0) {
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        } else {
            product.quantity = quantity;
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove an item from the cart
router.delete('/remove/:productId', async (req, res) => { // Changed '/cart/remove/:productId' to '/remove/:productId'
    const { productId } = req.params;

    try {
        const cid = getCidFromCookie(req); // Extract cid from cookies
        const cart = await Cart.findOne({ cid, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear the cart after purchase (Mark cart as purchased)
router.post('/checkout', async (req, res) => { // Changed '/cart/checkout' to '/checkout'
    try {
        const cid = getCidFromCookie(req); // Extract cid from cookies
        const cart = await Cart.findOne({ cid, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Mark the cart as purchased
        cart.status = 'purchased';
        await cart.save();

        res.json({ message: 'Checkout successful', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
