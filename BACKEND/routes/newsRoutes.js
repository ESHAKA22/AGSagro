const express = require('express');
const router = express.Router();
const News = require('../models/news');

// Create new news article
router.post('/', async (req, res) => {
    const news = new News({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
    });
    
    try {
        const savedNews = await news.save();
        res.status(201).json(savedNews);
    } catch (error) {
        console.error("Error saving news:", error);
        res.status(400).json({ message: "Failed to add news. Please try again." });
    }
});

// Get all news articles
router.get('/', async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Get a single news article by ID
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "News item not found." });
        }
        res.json(news);
    } catch (error) {
        console.error("Error fetching news item:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Update a news article by ID
router.put('/:id', async (req, res) => {
    console.log(`PUT request received for ID: ${req.params.id}`);
    try {
        const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: "News item not found." });
        }
        res.json(updatedNews);
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(400).json({ message: "Failed to update news. Please try again." });
    }
});

// Delete a news article by ID
router.delete('/:id', async (req, res) => {
    console.log(`DELETE request received for ID: ${req.params.id}`);
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).json({ message: "News item not found." });
        }
        res.json({ message: "News item deleted successfully." });
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Failed to delete news. Please try again." });
    }
});

module.exports = router;
