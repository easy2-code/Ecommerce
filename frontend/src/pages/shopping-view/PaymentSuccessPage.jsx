// 📁 Pages/shopping-view/PaymentSuccessPage.jsx - UPDATED
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetOrder } from "@/store/shop/order-slice";
import { clearCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    dispatch(resetOrder());

    // ✅ Force cart refresh on success page load
    if (user?.id) {
      setTimeout(() => {
        dispatch(fetchCartItems(user.id));
      }, 500);
    }
  }, [dispatch, user]);

  // ✅ Debug function to manually clear cart
  const handleManualClear = () => {
    dispatch(clearCart());
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-green-600">
      <div className="text-2xl font-semibold mb-4">
        ✅ Payment Successful! Thank you for your order.
      </div>
    </div>
  );
}
