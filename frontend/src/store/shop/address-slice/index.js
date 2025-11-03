import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  addressList: [],
  error: null,
};

// ✅ Add Address
export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/shop/address/add",
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
        throw new Error(data.message || "Failed to add address");

      return data.address;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch All Addresses (for specific user)
export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAllAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/address/get/${userId}`
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch addresses");

      return data.addresses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Edit Address
export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ userId, addressId, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/address/update/${userId}/${addressId}`,
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
        throw new Error(data.message || "Failed to update address");

      return data.updatedAddress; // assuming backend returns { updatedAddress: {...} }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete Address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/address/delete/${userId}/${addressId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to delete address");

      return addressId; // remove from frontend list
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Slice
export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Address
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList.push(action.payload);
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All Addresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Edit Address
      .addCase(editAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.addressList.findIndex(
          (addr) => addr._id === updated._id
        );
        if (index !== -1) state.addressList[index] = updated;
      })

      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addressList = state.addressList.filter(
          (addr) => addr._id !== action.payload
        );
      });
  },
});

export default addressSlice.reducer;
