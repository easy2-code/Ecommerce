// shop/products-slice/index.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
};

// ✅ Fetch All Products
export const fetchAllFilteredProducts = createAsyncThunk(
  "shoppingProducts/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/shop/products/all"
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch products");

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ShoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllFilteredProducts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productList = action.payload;
    });
    builder.addCase(fetchAllFilteredProducts.rejected, (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.productList = [];
    });
  },
});

export default ShoppingProductSlice.reducer;
