// routes/admin/order.route.js
import express from "express";
import {
  getAllOrdersForAdmin,
  getOrderDetails,
} from "../../controllers/admin/order.controller.js";

const router = express.Router();

router.get("/get", getAllOrdersForAdmin);
router.get("/details/:id", getOrderDetails);

export default router;
