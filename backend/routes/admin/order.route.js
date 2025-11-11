// routes/admin/order.route.js
import express from "express";
import {
  getAllOrdersForAdmin,
  getOrderDetails,
  updateOrderStatus,
} from "../../controllers/admin/order.controller.js";

const router = express.Router();

router.get("/get", getAllOrdersForAdmin);
router.get("/details/:id", getOrderDetails);
router.put("/update/:orderId", updateOrderStatus);

export default router;
