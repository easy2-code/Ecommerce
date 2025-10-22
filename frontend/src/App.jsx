import React from "react";
import { Route, Routes } from "react-router-dom";

// Auth
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/home";

// Admin
import AdminLayout from "./components/admin-view/AdminLayout";
import AdminDashboard from "./pages/admin-view/AdminDashboard";
import AdminProducts from "./pages/admin-view/AdminProducts";
import AdminOrders from "./pages/admin-view/AdminOrders";
import AdminFeatures from "./pages/admin-view/AdminFeatures";

// Shopping
import ShoppingLayout from "./components/shopping-view/ShoppingLayout";
import ShoppingHome from "./pages/shopping-view/ShoppingHome";
import ShoppingListing from "./pages/shopping-view/ShoppingListing";
import ShoppingCheckout from "./pages/shopping-view/ShoppingCheckout";
import ShoppingAccount from "./pages/shopping-view/ShoppingAccount";

// Common
import NotFound from "./pages/not-found/NotFound";
import CheckAuth from "./components/common/CheckAuth";
import UnAuth from "./pages/UnAuth/UnAuth";
import { useSelector } from "react-redux";

export default function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Shopping Routes */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />

        {/* UnAuthorized Page Route */}
        <Route path="/unauthorized" element={<UnAuth />} />
      </Routes>
    </div>
  );
}
