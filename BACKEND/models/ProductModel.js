const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  P_name: {
    type: String,
    required: true,
  },
  P_Image: {
    type: String, 
    required: true,
  },
  Category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: [
        'Engine Components',
        'Transmission & Drivetrain',
        'Hydraulic System',
        'Electrical System',
        'Fuel System',
        'Steering & Suspension',
        'Brakes',
        'Cooling System',
        'Exhaust System',
        'Body & Cab Components',
        'Tires & Wheels',
        'Filters & Maintenance Parts',
        'Implements & Attachments',
        'Safety & Accessories',
        'Other'
      ],
      message: "Please select a correct category"
    }
  },
  Manufacture: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Supplier_ID: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ProductModel", productSchema);
