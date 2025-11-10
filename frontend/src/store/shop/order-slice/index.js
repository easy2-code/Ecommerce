// shop/order-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  paymentSuccess: false,
  paymentData: null,
  error: null,
  orderList: [],
  orderDetails: null,
};

// 🧩 Create new PayPal order
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/shop/order/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const data = await response.json();
      return data; // { approvalURL, orderId, paypalOrderId }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Capture PayPal payment
export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async ({ orderId, paymentId, payerId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/shop/order/capture",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, paymentId, payerId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to capture payment");
      }

      const data = await response.json();
      return data; // { success, message, data: order }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Fetch all orders for a user
export const getAllOrderByUser = createAsyncThunk(
  "order/getAllOrderByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/order/list/${userId}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      return data.orders; // Array of orders
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Fetch a specific order’s details
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/details/${orderId}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order details");
      }

      return data.order; // Single order object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.approvalURL = null;
      state.orderId = null;
      state.paymentSuccess = false;
      state.paymentData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CREATE ORDER ---
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;

        // Store in sessionStorage for later use
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );

        state.orderId = {
          orderId: action.payload.orderId,
          paypalOrderId: action.payload.paypalOrderId,
        };
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })

      // --- CAPTURE PAYMENT ---
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentSuccess = true;
        state.paymentData = action.payload.data;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.paymentSuccess = false;
        state.error = action.payload || "Payment capture failed";
      })

      // --- GET ALL ORDERS ---
      .addCase(getAllOrderByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrderByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload || [];
      })
      .addCase(getAllOrderByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch orders";
      })

      // --- GET ORDER DETAILS ---
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch order details";
      });
  },
});

export const { resetOrder } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
