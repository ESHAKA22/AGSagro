const mongoose = require('mongoose'); // Change from import to require

const editSchema = new mongoose.Schema(
  {
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

const Edit = mongoose.model('Edit', editSchema);

module.exports = Edit; // Change from export default to module.exports
