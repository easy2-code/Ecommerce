// shop/products-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "shoppingProducts/fetchAllProducts",
  async (
    { category = [], brand = [], sort = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();

      if (category.length) query.append("category", category.join(","));
      if (brand.length) query.append("brand", brand.join(","));
      if (sort) query.append("sort", sort);

      const response = await fetch(
        `http://localhost:3000/api/shop/products/all?${query.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ShoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload;
      });
  },
});

export const { clearError } = ShoppingProductSlice.actions;
export default ShoppingProductSlice.reducer;
