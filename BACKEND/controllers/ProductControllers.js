const ProductModel = require("../models/ProductModel");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage }).single("P_Image");

// Create a new product
exports.createProduct = async (req, res) => {
  console.log('Starting image upload...');
  
  upload(req, res, async function (err) {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    console.log('Image upload successful:', req.file);

    try {
      const { P_name, Category, Manufacture, Price, Quantity, Description, Supplier_ID } = req.body;
      const P_Image = req.file ? req.file.path : null; // Cloudinary file path
      
      const product = new ProductModel({
        P_name,
        P_Image,
        Category,
        Manufacture,
        Price,
        Quantity,
        Description,
        Supplier_ID,
      });

      await product.save();
      res.status(201).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};


// Read all products (Get all products)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find(); // Get all products
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single product by ID (for details page or other use)
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product by ID (including image)
exports.updateProduct = async (req, res) => {
  console.log('Starting image upload...');

  upload(req, res, async function (err) {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    console.log('Image upload successful:', req.file);

    try {
      const { P_name, Category, Manufacture, Price, Quantity, Description, Supplier_ID } = req.body;
      
      // Find product by ID
      let product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      // If new image is uploaded, update image URL
      const P_Image = req.file ? req.file.path : product.P_Image;

      // Update product fields
      product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
          P_name,
          P_Image,
          Category,
          Manufacture,
          Price,
          Quantity,
          Description,
          Supplier_ID,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete the image from Cloudinary (optional, based on your needs)
    if (product.P_Image) {
      const imagePublicId = product.P_Image.split('/').pop().split('.')[0]; // Extract Cloudinary public ID
      await cloudinary.uploader.destroy(imagePublicId); // Delete the image from Cloudinary
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getStockStatusProducts = async (req, res) => {
  console.log("Request received at /stockstatus");
  try {
    const outOfStockProducts = await ProductModel.find({ quantity: 0 });
    const lowStockProducts = await ProductModel.find({ quantity: { $gt: 0, $lt: 15 } });
    
    if (!outOfStockProducts.length && !lowStockProducts.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for the stock status requested"
      });
    }

    return res.status(200).json({
      success: true,
      data: { outOfStockProducts, lowStockProducts }
    });
  } catch (error) {
    console.error("Error fetching stock status products:", error.message);
    return res.status(500).json({
      message: "Error fetching stock status products",
      error: error.message
    });
  }
};


// Get low stock and out of stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await ProductModel.find({
      $or: [
        { Quantity: { $gt: 0, $lt: 16 } },  // Low stock
        { Quantity: 0 }                    // Out of stock
      ]
    });
    res.status(200).json({ success: true, products: lowStockProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
