const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    customerId: { type: String, required: true }, 
    customerName: { type: String, required: true },
    companyName: { type: String },
    machineType: { type: String, required: true },
    machineModel: { type: String, required: true },
    partName: { type: String, required: true },
    partNumber: { type: String },
    material: { type: String, required: true },
    ManufactureYear: { type: String, required: true }, 
    surfaceFinish: { type: String },
    quantity: { type: Number, required: true },
    yourMessage: { type: String },
    designFile: { type: String },
    status: { type: String, default: 'Pending' }, // Status field with default value 'Pending'
    createdAt: { type: Date, default: Date.now }  // Automatically sets the date when the request is created
});

const CustomRequest = mongoose.model("CustomRequest", requestSchema);

module.exports = CustomRequest;
