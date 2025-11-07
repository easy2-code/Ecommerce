// 📁 Pages/shopping-view/PaypalReturnPage.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePayment } from "@/store/shop/order-slice";
import { clearCart } from "@/store/shop/cart-slice";
import { Spinner } from "@/components/ui/spinner"; // ✅ using your spinner

export default function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const payerId = params.get("PayerID");
  const paypalOrderId = params.get("token");

  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    // console.log("🔄 PayPal Return - Order ID:", orderId);
    // console.log("🔄 PayPal Return - PayerID:", payerId);
    // console.log("🔄 PayPal Return - Token:", paypalOrderId);

    if (payerId && paypalOrderId && orderId) {
      dispatch(
        capturePayment({
          orderId,
          paymentId: paypalOrderId,
          payerId,
        })
      )
        .then((res) => {
          // console.log("💰 Capture Payment Response:", res);

          if (res?.payload?.success) {
            // console.log("✅ Payment successful, clearing cart...");
            dispatch(clearCart());
            localStorage.removeItem("cartItems");
            sessionStorage.removeItem("currentOrderId");

            // Add a short delay for UX smoothness
            setTimeout(() => {
              navigate("/shop/payment-success");
            }, 2000);
          } else {
            console.error("❌ Payment capture failed", res?.payload?.message);
            navigate("/shop/payment-success");
          }
        })
        .catch((error) => {
          console.error("❌ Capture payment error:", error);
          navigate("/shop/payment-success");
        });
    } else {
      console.error("❌ Missing PayPal parameters");
      navigate("/shop/payment-success");
    }
  }, [dispatch, payerId, paypalOrderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-3">
      <Spinner className="w-12 h-12 text-black" /> {/* Spinner added */}
      <h2 className="text-lg font-semibold">Processing Payment...</h2>
      <p className="text-gray-500">
        Please don’t refresh or close this page while we confirm your payment.
      </p>
    </div>
  );
}
