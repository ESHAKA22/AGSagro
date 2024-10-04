const mongoose = require('mongoose'); // Change from import to require

const supplierSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier; 