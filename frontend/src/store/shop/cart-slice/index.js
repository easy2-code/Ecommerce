// shop/cart-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL + "/api/shop";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const data = await response.json();

      if (!response.ok) {
        // return the full error object/message for better debugging
        return rejectWithValue(
          data?.message || data || "Failed to add item to cart"
        );
      }

      // return full response (contains success, message, cart)
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/cart/get/${userId}`);

      // 🧩 If cart not found (after payment), just return empty cart gracefully
      if (response.status === 404) {
        console.info(
          "🧺 Cart not found — returning empty array (cleared after checkout)."
        );
        return [];
      }

      // ✅ Only parse JSON if response has a body
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data?.message || "Failed to fetch cart");
      }

      return data.cart.items || [];
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data?.message || "Failed to delete cart item");
      }
      return data.cart.items;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update cart item quantity
export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/cart/update-cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data?.message || "Failed to update cart item");
      }
      return data.cart.items;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      // payload now contains { success, message, cart }
      state.cartItems = action.payload?.cart?.items ?? [];
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? action.error?.message;
    });

    // Fetch cart
    builder.addCase(fetchCartItems.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload ?? [];
    });
    builder.addCase(fetchCartItems.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? action.error?.message;
    });

    // Delete cart item
    builder.addCase(deleteCartItem.pending, (state) => {
      // state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload ?? [];
    });
    builder.addCase(deleteCartItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? action.error?.message;
    });

    // Update cart item quantity
    builder.addCase(updateCartItemQty.pending, (state) => {
      // state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemQty.fulfilled, (state, action) => {
      // state.isLoading = false;
      state.cartItems = action.payload ?? [];
    });
    builder.addCase(updateCartItemQty.rejected, (state, action) => {
      // state.isLoading = false;
      state.error = action.payload ?? action.error?.message;
    });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
