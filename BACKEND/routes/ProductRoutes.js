const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductControllers");


router.get("/lowstock", ProductController.getLowStockProducts);


// CRUD routes
router.post("/create", ProductController.createProduct); // Create
router.get("/", ProductController.getAllProducts); // Read all products
router.get("/:id", ProductController.getProductById); // Read one product
router.put("/:id", ProductController.updateProduct); // Update
router.delete("/:id", ProductController.deleteProduct); // Delete

module.exports = router;
