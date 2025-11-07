// 📁 Pages/shopping-view/PaymentSuccessPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetOrder } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner"; // ✅ import shadcn spinner

export default function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Reset current order
    dispatch(resetOrder());

    // Refresh cart items
    if (user?.id) {
      setTimeout(() => {
        dispatch(fetchCartItems(user.id));
      }, 500);
    }

    // Redirect to Orders page after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/shop/account"); // replace with your ShoppingOrders route
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [dispatch, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-green-600 gap-4">
      <Spinner className="w-12 h-12 text-black" /> {/* Spinner added */}
      <div className="text-2xl font-semibold">
        ✅ Payment Successful! Thank you for your order.
      </div>
      <p className="text-gray-500">Redirecting you to your orders page...</p>
    </div>
  );
}
