// routes/shop/products.route.js

import express from "express";

import { getFilteredProducts } from "../../controllers/shop/products.controller.js";

const router = express.Router();

// ✅ Get all products
router.get("/all", getFilteredProducts);

export default router;
