// controllers/shop/order.controller.js
import { ordersController } from "../../helpers/paypal.js";
import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus = "pending",
      paymentMethod = "paypal",
      paymentStatus = "pending",
      totalAmount,
      orderDate = new Date(),
      orderUpdateDate = new Date(),
      paymentId,
      payerId,
    } = req.body;

    if (!cartItems || !totalAmount || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: cartItems, totalAmount, or userId",
      });
    }

    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for user",
      });
    }

    const cartId = userCart._id;

    const items = cartItems.map((item, index) => {
      let price;

      if (item.price !== undefined && item.price !== null) {
        price = parseFloat(item.price);
      } else if (item.productId?.salePrice > 0) {
        price = parseFloat(item.productId.salePrice);
      } else if (item.productId?.price) {
        price = parseFloat(item.productId.price);
      } else {
        throw new Error(`Invalid price for item: ${item.title || "Unknown"}`);
      }

      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.title || "Unknown"}`);
      }

      return {
        name: (item.title || item.productId?.title || "Product").substring(
          0,
          127
        ),
        unit_amount: {
          currency_code: "USD",
          value: price.toFixed(2),
        },
        quantity: item.quantity?.toString() || "1",
        sku: item._id || item.productId?._id || item.id || "1",
      };
    });

    const calculatedTotal = cartItems
      .reduce((sum, item) => {
        let price;

        if (item.price !== undefined && item.price !== null) {
          price = parseFloat(item.price);
        } else if (item.productId?.salePrice > 0) {
          price = parseFloat(item.productId.salePrice);
        } else if (item.productId?.price) {
          price = parseFloat(item.productId.price);
        } else {
          price = 0;
        }

        const quantity = parseInt(item.quantity) || 1;
        return sum + price * quantity;
      }, 0)
      .toFixed(2);

    if (
      Math.abs(parseFloat(calculatedTotal) - parseFloat(totalAmount)) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: `Total amount mismatch. Calculated: ${calculatedTotal}, Provided: ${totalAmount}`,
      });
    }

    const paypalRequest = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: parseFloat(totalAmount).toFixed(2),
              breakdown: {
                itemTotal: {
                  currencyCode: "USD",
                  value: calculatedTotal,
                },
              },
            },
            items: items.map((item) => ({
              name: item.name.substring(0, 127),
              unitAmount: {
                currencyCode: "USD",
                value: parseFloat(item.unit_amount.value).toFixed(2),
              },
              quantity: item.quantity.toString(),
              sku: item.sku,
            })),
          },
        ],
        applicationContext: {
          returnUrl: `${FRONTEND_URL}/shop/paypal-return`,
          cancelUrl: `${FRONTEND_URL}/shop/paypal-cancel`,
          userAction: "PAY_NOW",
          shippingPreference: "NO_SHIPPING",
        },
      },
    };

    const response = await ordersController.createOrder(paypalRequest);

    if (response.statusCode !== 201) {
      throw new Error(`PayPal API returned status: ${response.statusCode}`);
    }

    const paypalOrder = response.result;

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      paypalOrderId: paypalOrder.id,
    });

    await newlyCreatedOrder.save();

    const approvalLink = paypalOrder.links?.find(
      (link) => link.rel === "approve"
    );

    if (!approvalLink) {
      throw new Error("No approval URL found in PayPal response");
    }

    res.status(201).json({
      success: true,
      approvalURL: approvalLink.href,
      orderId: newlyCreatedOrder._id,
      paypalOrderId: paypalOrder.id,
    });
  } catch (error) {
    let errorMessage = "Some error occurred while creating PayPal order.";
    if (error.statusCode === 401) {
      errorMessage =
        "PayPal authentication failed. Check your client ID and secret.";
    } else if (error.message.includes("Invalid price")) {
      errorMessage = error.message;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found!",
      });
    }

    const userId = order.userId;
    await Cart.findOneAndDelete({ userId });

    // ✅ Only update payment fields
    order.paymentStatus = "paid";
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    // ⚠️ Keep orderStatus as it was (likely "pending")
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully. Awaiting admin confirmation.",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment capture failed",
    });
  }
};

// 🧾 Get all orders placed by a specific user
export const getAllOrderByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find all orders by this user, most recent first
    const orders = await Order.find({ userId })
      .populate({
        path: "cartItems.productId",
        model: "Product",
        select: "title price image description salePrice",
      })
      .sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this user",
        orders: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching user orders",
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
      order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching order details",
    });
  }
};
