const mongoose = require('mongoose'); 

const contractSchema = new mongoose.Schema(
  {
    SupId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactp: {
      type: String,
      required: true,
    },
    startdate: {
      type: String,
      required: true,
    },
    enddate: {
      type: String,
      required: true,
    },
    Terms: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      required: true,
    },
    delivery: {
      type: String,
      required: true,
    },
    Renewal: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract; 