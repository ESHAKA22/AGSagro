const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const clientSchema = new Schema({
    cid: Number,
    country: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    email: String,
    paymentMethods: String,
    phone: Number,
    nic: Number,
    zipCode: Number,
    userName: String,
    password: String,
    regDate: Date,
});

const Client = mongoose.model('Client',clientSchema);

module.exports = Client;