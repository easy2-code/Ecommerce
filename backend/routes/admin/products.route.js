// routes/admin/products.route.js

import express from "express";
import { upload } from "../../helpers/cloudinary.js";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  handleImageUpload,
} from "../../controllers/admin/products.controller.js";

const router = express.Router();

// ✅ Upload product image
router.post("/upload-image", upload.single("file"), handleImageUpload);

// ✅ Add new product
router.post("/add", addProduct);

// ✅ Get all products
router.get("/all", fetchAllProducts);

// ✅ Edit a product by ID
router.put("/edit/:id", editProduct);

// ✅ Delete a product by ID
router.delete("/delete/:id", deleteProduct);

export default router;
