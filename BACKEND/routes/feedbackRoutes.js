const express = require('express');
const router = express.Router();
const CustomerFeedback = require('../models/customerFeedback');

// POST route to submit feedback
router.post('/submit', async (req, res) => {
    const feedbackData = new CustomerFeedback(req.body);
    try {
        await feedbackData.save();
        res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// GET route to view all feedback
router.get('/view', async (req, res) => {
    try {
        const feedbacks = await CustomerFeedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

// GET route to view specific feedback by ID
router.get('/view/:id', async (req, res) => {
    try {
        const feedback = await CustomerFeedback.findById(req.params.id);
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// PUT route to edit specific feedback by ID
router.put('/edit/:id', async (req, res) => {
    try {
        const updatedFeedback = await CustomerFeedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update feedback' });
    }
});

// DELETE route to remove specific feedback by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        await CustomerFeedback.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
});

module.exports = router;
