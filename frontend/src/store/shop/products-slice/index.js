// shop/products-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
  productDetails: null,
  isProductListLoading: false,
  isProductDetailsLoading: false,
  error: null,
};

// ✅ Fetch all filtered products
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

// ✅ Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  "shoppingProducts/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/products/get/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product details");
      }

      return data.data; // single product object
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
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch all products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isProductListLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isProductListLoading = false;
        state.productList = action.payload;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isProductListLoading = false;
        state.productList = [];
        state.error = action.payload;
      })

      // ✅ Fetch single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isProductDetailsLoading = true;
        state.error = null;
        state.productDetails = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isProductDetailsLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isProductDetailsLoading = false;
        state.productDetails = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProductDetails } = ShoppingProductSlice.actions;
export default ShoppingProductSlice.reducer;
