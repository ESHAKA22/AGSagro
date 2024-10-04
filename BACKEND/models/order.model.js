const mongoose = require('mongoose'); // Change from import to require

const orderSchema = new mongoose.Schema(
  {
    Iname: {
      type: String,
      required: true,
    },
    quntity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; // Change from export default to module.exports
