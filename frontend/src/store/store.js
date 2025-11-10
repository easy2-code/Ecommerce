// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductSlice from "./admin/products-slice";
import ShoppingProductSlice from "./shop/products-slice";
import shoppingCartSlice from "./shop/cart-slice";
import shoppingAddressSlice from "./shop/address-slice";
import shoppingOrderSlice from "./shop/order-slice";
import adminOrderSlice from "./admin/order-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: AdminProductSlice,
    adminOrder: adminOrderSlice,

    shopProducts: ShoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: shoppingAddressSlice,
    shopOrder: shoppingOrderSlice,
  },
});

export default store;
