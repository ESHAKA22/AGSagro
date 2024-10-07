const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockReplenishmentRequestSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  supplierId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1 
  },
  requestDate: {
    type: Date,
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending' 
  },
  Reason: {
    type: String,
    default: '',
    trim: true
  }

});

module.exports = mongoose.model('StockReplenishmentRequest', StockReplenishmentRequestSchema);
