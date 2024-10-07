const express = require('express');
const router = express.Router();
const StockReplenishmentRequestController = require('../controllers/StockReplenishmentRequestController');

// Stock Manager routes
router.post('/requests', StockReplenishmentRequestController.createRequest);
router.get('/requests', StockReplenishmentRequestController.getAllRequests);
router.put('/requests/:id/quantity', StockReplenishmentRequestController.updateRequestQuantity);
router.delete('/requests/:id', StockReplenishmentRequestController.deleteRequest);

// Supplier routes
router.put('/requests/:id/status', StockReplenishmentRequestController.updateRequestStatus);

module.exports = router;
