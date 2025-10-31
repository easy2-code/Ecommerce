// routes/shop/products.route.js

import express from "express";

import {
  getFilteredProducts,
  getProductDetails,
} from "../../controllers/shop/products.controller.js";

const router = express.Router();

// Get all products
router.get("/all", getFilteredProducts);
router.get("/get/:id", getProductDetails);

export default router;
