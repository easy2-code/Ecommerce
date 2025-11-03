// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductSlice from "./admin/products-slice";
import ShoppingProductSlice from "./shop/products-slice";
import shoppingCartSlice from "./shop/cart-slice";
import shoppingAddressSlice from "./shop/address-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductSlice,
    shopProducts: ShoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: shoppingAddressSlice,
  },
});

export default store;
