// components/shopping-view/UserCartWrapper.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { fetchCartItems } from "@/store/shop/cart-slice";
import UserCartItemsContent from "./UserCartItemsContent";

export default function UserCartWrapper() {
  const dispatch = useDispatch();
  const { cartItems, isLoading } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  // Fetch cart whenever user changes or when cart updates
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Calculate total price
  const total = cartItems.reduce((sum, item) => {
    const price = item?.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Calculate total quantity of all items
  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <SheetContent className="sm:max-w-md p-6 bg-white shadow-md">
      <SheetHeader>
        <SheetTitle className="text-lg font-semibold">Your Cart</SheetTitle>
        {/* Total items count */}
        {cartItems.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {totalItemsCount} item{totalItemsCount > 1 ? "s" : ""} in cart
          </p>
        )}
      </SheetHeader>

      {isLoading ? (
        <div className="text-center text-gray-500 mt-6">Loading...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">
          Your cart is empty.
        </div>
      ) : (
        <div className="mt-8 max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {cartItems.map((item) => (
            <UserCartItemsContent key={item._id} cartItem={item} />
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="mt-6 flex justify-between font-bold text-gray-800 text-lg">
            <span>Total Amount</span>
            <span>${total}</span>
          </div>

          <Button className="w-full mt-6">Check Out</Button>
        </>
      )}
    </SheetContent>
  );
}
