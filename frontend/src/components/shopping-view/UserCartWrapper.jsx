// components/shopping-view/UserCartWrapper.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
} from "@/store/shop/cart-slice";
import UserCartItemsContent from "./UserCartItemsContent";
import { PackageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UserCartWrapper({ setOpenCartSheet }) {
  const dispatch = useDispatch();
  const { cartItems, isLoading } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch cart whenever user changes or when cart updates
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Calculate total price considering salePrice if available
  const total = cartItems.reduce((sum, item) => {
    const price =
      item?.productId?.salePrice > 0
        ? item.productId?.salePrice
        : item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Total quantity of all items
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Total unique items
  const uniqueItemsCount = cartItems.length;

  // Increment quantity with stock check
  const handleIncrement = async (cartItem) => {
    if (cartItem.quantity >= cartItem.productId.totalStock) {
      toast.error("You have reached the maximum stock available! ❌");
      return;
    }

    try {
      await dispatch(
        updateCartItemQty({
          userId: user?.id,
          productId: cartItem?.productId?._id,
          quantity: cartItem.quantity + 1,
        })
      ).unwrap();
    } catch (err) {
      toast.error(err || "Failed to update quantity ❌");
    }
  };

  // Decrement quantity
  const handleDecrement = async (cartItem) => {
    if (cartItem.quantity <= 1) return;
    try {
      await dispatch(
        updateCartItemQty({
          userId: user?.id,
          productId: cartItem.productId._id,
          quantity: cartItem.quantity - 1,
        })
      ).unwrap();
    } catch (err) {
      toast.error(err || "Failed to update quantity ❌");
    }
  };

  // Delete cart item
  const handleDelete = async (cartItem) => {
    try {
      await dispatch(
        deleteCartItem({
          userId: user?.id,
          productId: cartItem.productId._id,
        })
      ).unwrap();
      toast.success("Item removed from cart ✅");
    } catch (err) {
      toast.error(err || "Failed to remove item ❌");
    }
  };

  return (
    <SheetContent
      className="w-[330px] sm:w-auto max-w-md sm:max-w-lg md:max-w-xl p-6 bg-white shadow-md"
      aria-describedby={undefined}
    >
      <SheetHeader>
        <SheetTitle className="text-lg font-semibold">Your Cart</SheetTitle>
        {cartItems.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {uniqueItemsCount} unique item{uniqueItemsCount > 1 ? "s" : ""},{" "}
            {totalQuantity} item{totalQuantity > 1 ? "s" : ""} in cart
          </p>
        )}
      </SheetHeader>

      {isLoading ? (
        <div className="text-center text-gray-500 mt-6">Loading...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-6 flex flex-col items-center gap-2">
          <PackageIcon className="w-12 h-12 text-gray-400" />
          <span>Your cart is empty.</span>
        </div>
      ) : (
        <div className="mt-8 max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {cartItems.map((item) => (
            <UserCartItemsContent
              key={item._id}
              cartItem={item}
              handleIncrement={() => handleIncrement(item)}
              handleDecrement={() => handleDecrement(item)}
              handleDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="mt-6 flex justify-between font-bold text-gray-800 text-lg">
            <span>Total Amount</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-6"
          >
            Check Out
          </Button>
        </>
      )}
    </SheetContent>
  );
}
