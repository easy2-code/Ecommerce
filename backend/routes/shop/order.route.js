// routes/order.route.js
import express from "express";
import {
  capturePayment,
  createOrder,
  getAllOrderByUser,
  getOrderDetails,
} from "../../controllers/shop/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrderByUser);
router.get("/details/:id", getOrderDetails);

export default router;
