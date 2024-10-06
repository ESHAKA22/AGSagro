const mongoose = require('mongoose');

const customerFeedbackSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    checkInDate: {
        type: Date,
    },
    hearAboutUs: {
        type: String, // 'Friends', 'Social Media', 'Ads'
    },
    purposeOfVisit: {
        type: String, // 'Products Buy', 'Visit To Web'
    },
    serviceRating: {
        type: String, // 'Very Good', 'Good', 'Bad'
    },
    comments: {
        type: String,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
});

module.exports = mongoose.model('CustomerFeedback', customerFeedbackSchema);