// store/admin/products-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

// ✅ Add Product
export const addNewProduct = createAsyncThunk(
  "adminProducts/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/products/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to add product");

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch All Products
export const fetchAllProducts = createAsyncThunk(
  "adminProducts/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/products/all"
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

// ✅ Edit Product
export const editProduct = createAsyncThunk(
  "adminProducts/editProduct",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/products/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to update product");

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete Product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/products/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to delete product");

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Slice
const AdminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList.push(action.payload);
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Edit Product
      .addCase(editProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.productList.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.productList[index] = updated;
      })

      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productList = state.productList.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export default AdminProductSlice.reducer;
