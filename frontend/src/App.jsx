import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

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
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "./components/common/Footer";

export default function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation(); // get current route

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-10">
        <Skeleton className="h-12 w-1/3 rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
        <div className="flex space-x-4">
          <Skeleton className="h-32 w-1/2 rounded-md" />
          <Skeleton className="h-32 w-1/2 rounded-md" />
        </div>
      </div>
    );
  }

  // Define routes where footer should NOT appear
  const noFooterRoutes = ["/auth/login", "/auth/register"];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-white">
      <div className="flex-grow">
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

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<UnAuth />} />
        </Routes>
      </div>

      {/* Render Footer only if current path is NOT in noFooterRoutes */}
      {!noFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}
