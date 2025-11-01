// shop/products-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
  productDetails: null,
  isProductListLoading: false,
  isProductDetailsLoading: false,
  error: null,
  currentFetchId: null, // ✅ Track latest fetch to cancel older ones
};

// ✅ Fetch all filtered products
export const fetchAllFilteredProducts = createAsyncThunk(
  "shoppingProducts/fetchAllProducts",
  async (
    { category = [], brand = [], sort = "" } = {},
    { getState, signal, requestId, rejectWithValue }
  ) => {
    try {
      const { currentFetchId, isProductListLoading } = getState().shopProducts;

      // 🛑 Prevent duplicate fetches while another is running
      if (isProductListLoading && currentFetchId !== requestId) {
        return rejectWithValue("Duplicate request canceled");
      }

      const query = new URLSearchParams();
      if (category.length) query.append("category", category.join(","));
      if (brand.length) query.append("brand", brand.join(","));
      if (sort) query.append("sort", sort);

      const response = await fetch(
        `http://localhost:3000/api/shop/products/all?${query.toString()}`,
        { signal } // ✅ attach signal for abort support
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch products");

      return data.data;
    } catch (error) {
      // Ignore abort errors
      if (error.name === "AbortError")
        return rejectWithValue("Request aborted");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  "shoppingProducts/fetchProductDetails",
  async (id, { signal, rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/products/get/${id}`,
        { signal }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product details");
      }

      return data.data; // single product object
    } catch (error) {
      if (error.name === "AbortError")
        return rejectWithValue("Request aborted");
      return rejectWithValue(error.message);
    }
  }
);

export const ShoppingProductSlice = createSlice({
  name: "shopProducts",
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
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isProductListLoading = true;
        state.error = null;
        state.currentFetchId = action.meta.requestId; // Track active request
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        // ✅ Only apply if this is the latest request
        if (state.currentFetchId === action.meta.requestId) {
          state.isProductListLoading = false;
          state.productList = action.payload;
          state.currentFetchId = null;
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        if (state.currentFetchId === action.meta.requestId) {
          state.isProductListLoading = false;
          // If the request was canceled, don’t clear the list
          if (action.payload !== "Request aborted") {
            state.productList = [];
          }
          state.error = action.payload;
          state.currentFetchId = null;
        }
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
