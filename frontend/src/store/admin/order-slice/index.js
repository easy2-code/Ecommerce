// store/admin/order-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
  error: null,
};

// 🧩 Fetch all orders for admin
export const getAllOrdersForAdmin = createAsyncThunk(
  "adminOrder/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/orders/get`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      return data.data; // ✅ admin API returns "data" key
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Fetch a specific order’s details
export const getOrderDetailsForAdmin = createAsyncThunk(
  "adminOrder/getOrderDetailsForAdmin",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/orders/details/${orderId}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order details");
      }

      return data.data; // ✅ admin API returns "data" key
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ getAllOrdersForAdmin
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ✅ getOrderDetailsForAdmin
    builder
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminOrderSlice.reducer;
