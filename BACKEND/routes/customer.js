const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const SupportTicket = require("../models/supportticket");

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// CREATE: Add a new support ticket with file upload
router.post("/add", upload.single('attachment'), async (req, res) => {
    const { first_name, last_name, email, phone_number, priority_level, problem, comments } = req.body;

    if (!first_name || !last_name || !email || !phone_number || !priority_level || !problem || !comments) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        const supportTicket = new SupportTicket({
            first_name,
            last_name,
            email,
            phone_number,
            priority_level,
            problem,
            attachment: req.file ? req.file.path : "",
            comments
        });
        await supportTicket.save();
        res.status(201).send(supportTicket);
    } catch (error) {
        res.status(400).send({ message: "Failed to add support ticket", error });
    }
});

// GET: Fetch all support tickets
router.get("/tickets", async (req, res) => {
    try {
        const tickets = await SupportTicket.find();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch tickets", error });
    }
});

// GET: Fetch a single support ticket by ID
router.get("/tickets/:id", async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found" });
        }
        res.status(200).send(ticket);
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch the ticket", error });
    }
});

// UPDATE: Update a support ticket by ID
router.put("/update/:id", upload.single('attachment'), async (req, res) => {
    const { first_name, last_name, email, phone_number, priority_level, problem, comments } = req.body;

    if (!first_name || !last_name || !email || !phone_number || !priority_level || !problem || !comments) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found" });
        }

        ticket.first_name = first_name;
        ticket.last_name = last_name;
        ticket.email = email;
        ticket.phone_number = phone_number;
        ticket.priority_level = priority_level;
        ticket.problem = problem;
        ticket.comments = comments;
        if (req.file) {
            ticket.attachment = req.file.path;
        }

        await ticket.save();
        res.status(200).send(ticket);
    } catch (error) {
        res.status(400).send({ message: "Failed to update ticket", error });
    }
});

// DELETE: Delete a support ticket by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedTicket = await SupportTicket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).send({ message: "Ticket not found" });
        }
        res.status(200).send({ message: "Ticket deleted successfully", ticket: deletedTicket });
    } catch (error) {
        res.status(500).send({ message: "Failed to delete ticket", error });
    }
});

module.exports = router;
