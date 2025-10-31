// routes/cart.route.js
import express from "express";
import {
  addToCart,
  deleteCartItem,
  fetchCartItems,
  updateCartItemQty,
} from "../../controllers/shop/cart.controller.js";

const router = express.Router();

// Add product to cart
router.post("/add", addToCart);

// Get all cart items for a user
router.get("/get/:userId", fetchCartItems);

// Update quantity of a cart item
router.put("/update-cart", updateCartItemQty);

// Delete a cart item
router.delete("/:userId/:productId", deleteCartItem);

export default router;
