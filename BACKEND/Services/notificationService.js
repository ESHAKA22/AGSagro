const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use another email service provider
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password' // Replace with your email password
    }
});

// Send Notification Email
const sendNotification = (email, subject, message) => {
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender email
        to: email, // Recipient email
        subject: subject,
        text: message
    };

    return transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending notification:', error);
        } else {
            console.log('Notification sent:', info.response);
        }
    });
};

module.exports = {
    sendNotification
};
