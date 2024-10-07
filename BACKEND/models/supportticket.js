const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supportTicketSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    priority_level: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    attachment: {
        type: String, 
        required: false
    },
    comments: {
        type: String,
        required: true
    }
});

const SupportTicket = mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
