const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    SupId: {
      type: String,
      required: true,
    },
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
    supname: {
      type: String,
      required: true,
    },
    contname: {
      type: String,
      required: true,
    },
    contactN: {
      type: String,
      required: true,
    },
    headAddress: {
      type: String,
      required: true,
    },
    factoryAddress: {
      type: String,
      required: true,
    },
    counuty: {
      type: String,
      required: true,
    },
    businessNumber: {
      type: String,
      required: true,
    },
    taxnumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
