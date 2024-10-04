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
    const customRequest = new CustomRequest({
        customerId: req.body.customerId, // Add customerId field
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
        designFile: req.file ? req.file.path : '' // Save file path
    });

    try {
        const newRequest = await customRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ all custom requests (GET)
router.get('/', async (req, res) => {
    try {
        const customRequests = await CustomRequest.find();
        res.json(customRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ a specific custom request by ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const customRequest = await CustomRequest.findById(req.params.id);
        if (!customRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(customRequest);
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

module.exports = router;
