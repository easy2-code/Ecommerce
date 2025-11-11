// controllers/admin/order.controller.js
import Order from "../../models/order.model.js";

// ✅ Get all orders for admin
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

// ✅ Get detailed info for a specific order by orderId
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

// ✅ Update order status by orderId
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // clearer than 'id'
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const validStatuses = [
      "Pending",
      "In Process",
      "In Shipping",
      "Rejected",
      "Delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: status.toLowerCase(),
        orderUpdateDate: new Date(),
      },
      { new: true }
    ).populate({
      path: "cartItems.productId",
      model: "Product",
      select: "title price image description salePrice",
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while updating order status",
      error: error.message,
    });
  }
};
