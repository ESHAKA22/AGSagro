const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const loyaltySchema = new Schema({
    loyaltyId: Number,
    cid: Number,
    cusName: String,
    Country: String,
    info: String,
    status: String,
});

const Loyalty = mongoose.model('Loyalty',loyaltySchema);

module.exports = Loyalty;