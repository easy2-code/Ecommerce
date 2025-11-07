// 📁 Pages/shopping-view/ShoppingCheckout.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import img1 from "@/assets/Home-Page-Images/1.jpg";
import img2 from "@/assets/Home-Page-Images/2.jpg";
import img3 from "@/assets/Home-Page-Images/3.jpg";
import img4 from "@/assets/Home-Page-Images/4.jpg";
import img5 from "@/assets/Home-Page-Images/5.jpg";

import Address from "@/components/shopping-view/Address";
import UserCartItemsContent from "@/components/shopping-view/UserCartItemsContent";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createNewOrder } from "@/store/shop/order-slice";

export default function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, isLoading } = useSelector((state) => state.shopCart);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  const images = [img1, img2, img3, img4, img5];
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // ✅ Auto slideshow
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  // 📁 Pages/shopping-view/ShoppingCheckout.jsx - UPDATED useEffect
  useEffect(() => {
    if (user?.id) {
      // ✅ ALWAYS fetch cart, but add a small delay on return from PayPal
      if (window.location.href.includes("paypal-return")) {
        // If returning from PayPal, wait a bit then fetch
        setTimeout(() => {
          dispatch(fetchCartItems(user.id));
        }, 1000);
      } else {
        dispatch(fetchCartItems(user.id));
      }
    }
  }, [dispatch, user]);

  // ✅ Calculate total amount
  const totalAmount = useMemo(() => {
    return cartItems?.reduce((acc, item) => {
      const price =
        item?.productId?.salePrice > 0
          ? item?.productId?.salePrice
          : item?.productId?.price;
      return acc + price * item?.quantity;
    }, 0);
  }, [cartItems]);

  function handleInitialPaypalPaymnt() {
    if (!currentSelectedAddress) {
      toast.error("⚠️ Please select a shipping address before checkout!");
      return;
    }

    // ✅ We need to fetch the actual cart to get the cart ID
    // Since Redux only has cart items, we need to get the cart ID differently
    const orderData = {
      userId: user?.id,
      // ❌ Remove cartId for now - we'll handle this differently
      // cartId: cartItems?._id, // This was wrong - cartItems is array!
      cartItems: cartItems.map((item) => ({
        productId: item.productId._id || item.productId,
        title: item.productId.title || item.title,
        image: item.productId.image || item.image,
        price:
          item.productId.salePrice > 0
            ? item.productId.salePrice
            : item.productId.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone,
        note: currentSelectedAddress.notes || "",
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paypalOrderId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      // console.log(data);
      if (data?.payload.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }
  return (
    <div className="flex flex-col">
      {/* ✅ Slideshow */}
      <div className="relative w-full h-screen overflow-hidden mb-10">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* ✅ Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex ? "bg-white scale-110" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Checkout Layout */}
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-8 text-center">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* 🏠 Address Section (Left) */}
          <div className="w-full lg:w-1/1 bg-gray-50 rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
          </div>

          {/* 🛍️ Cart Section (Right) */}
          <div className="w-full lg:w-1/2 bg-gray-50 rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

            {isLoading ? (
              <p>Loading your cart...</p>
            ) : cartItems && cartItems.length > 0 ? (
              <>
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <UserCartItemsContent
                      key={item.productId._id}
                      cartItem={item}
                    />
                  ))}
                </div>

                {/* ✅ Total + PayPal Button */}
                <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-lg font-semibold">
                    Total:{" "}
                    <span className="text-green-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleInitialPaypalPaymnt}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg flex items-center justify-center gap-2 py-2 px-4 transition"
                  >
                    <img
                      src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                      alt="PayPal"
                      className="w-5 h-5"
                    />
                    Checkout with PayPal
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
