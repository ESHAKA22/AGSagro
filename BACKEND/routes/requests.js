const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CustomRequest = require('../models/CustomRequest');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// CREATE a new custom request (POST)
router.post('/', upload.single('designFile'), async (req, res) => {
    try {
        const customerId = req.body.customerId || req.cookies.customerId; // Get customerId from body or cookie
        if (!customerId) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        const customRequest = new CustomRequest({
            customerId,
            customerName: req.body.customerName,
            companyName: req.body.companyName,
            machineType: req.body.machineType,
            machineModel: req.body.machineModel,
            partName: req.body.partName,
            partNumber: req.body.partNumber,
            material: req.body.material,
            ManufactureYear: req.body.ManufactureYear,
            surfaceFinish: req.body.surfaceFinish,
            quantity: req.body.quantity,
            yourMessage: req.body.yourMessage,
            designFile: req.file ? req.file.path : '', // Save file path if a file is uploaded
            status: 'Pending' // Default status
        });

        const newRequest = await customRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ all custom requests by customerId (GET)
router.get('/customer', async (req, res) => {
    const customerId = req.cookies.customerId; // Get customerId from the cookies
    
    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        const customRequests = await CustomRequest.find({ customerId });
        if (customRequests.length === 0) {
            return res.status(404).json({ message: 'No custom requests found for this customer.' });
        }
        res.json(customRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE a custom request by ID (PUT)
router.put('/:id', upload.single('designFile'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.designFile = req.file.path; // Update file path if a new file is uploaded
        }

        const customRequest = await CustomRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!customRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(customRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a custom request by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const customRequest = await CustomRequest.findByIdAndDelete(req.params.id);
        if (!customRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json({ message: 'Request deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch ALL custom requests (GET)
router.get('/', async (req, res) => {
    try {
        const customRequests = await CustomRequest.find();  // Fetch all requests, no customer filter
        res.json(customRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// APPROVE a custom request by ID (PUT)
router.put('/:id/approve', async (req, res) => {
    try {
        const requestId = req.params.id;

        // Find the request and update the status to 'Approved'
        const updatedRequest = await CustomRequest.findByIdAndUpdate(
            requestId, 
            { status: 'Approved' }, 
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve request' });
    }
});

module.exports = router;
