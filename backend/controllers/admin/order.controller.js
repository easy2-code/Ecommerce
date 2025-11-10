// controllers/admin/order.controller.js
import Order from "../../models/order.model.js";

// 🧾 Get all orders for admin
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "cartItems.productId",
        model: "Product",
        select: "title price image description salePrice",
      })
      .sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching orders",
      error: error.message,
    });
  }
};

// 🧾 Get detailed info for a specific order by orderId
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(id).populate({
      path: "cartItems.productId",
      model: "Product",
      select: "title price image description salePrice",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching order details",
      error: error.message,
    });
  }
};
