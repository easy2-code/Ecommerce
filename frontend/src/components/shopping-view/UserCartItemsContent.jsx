// components/shopping-view/UserCartItemsContent.jsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";

export default function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingType, setUpdatingType] = useState(null); // "increase" or "decrease"

  const imageSrc = Array.isArray(cartItem?.productId?.image)
    ? cartItem.productId.image[0]
    : cartItem?.productId?.image;

  const price =
    cartItem?.productId?.salePrice > 0
      ? cartItem?.productId?.salePrice
      : cartItem?.productId?.price;

  const total = (price * cartItem?.quantity).toFixed(2);

  // 🗑️ Delete item
  async function handleCartItemDelete(getCartItem) {
    setIsDeleting(true);
    try {
      await dispatch(
        deleteCartItem({
          userId: user?.id,
          productId: getCartItem?.productId?._id,
        })
      ).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  // ➕ Increase quantity
  async function handleIncreaseQty() {
    setUpdatingType("increase");
    try {
      await dispatch(
        updateCartItemQty({
          userId: user?.id,
          productId: cartItem?.productId?._id,
          quantity: cartItem.quantity + 1,
        })
      ).unwrap();
    } catch (err) {
      console.error("Increase failed:", err);
    } finally {
      setUpdatingType(null);
    }
  }

  // ➖ Decrease quantity
  async function handleDecreaseQty() {
    if (cartItem.quantity <= 1) return;
    setUpdatingType("decrease");
    try {
      await dispatch(
        updateCartItemQty({
          userId: user?.id,
          productId: cartItem?.productId?._id,
          quantity: cartItem.quantity - 1,
        })
      ).unwrap();
    } catch (err) {
      console.error("Decrease failed:", err);
    } finally {
      setUpdatingType(null);
    }
  }

  return (
    <div className="flex items-center space-x-4 border-b py-4">
      <img
        src={imageSrc}
        alt={cartItem?.productId?.title || "Product"}
        className="w-20 h-20 rounded object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{cartItem?.productId?.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleDecreaseQty}
            disabled={updatingType !== null}
          >
            {updatingType === "decrease" ? (
              <Loader2 className="animate-spin w-4 h-4 text-gray-600" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span className="sr-only">Decrease</span>
          </Button>

          <span className="font-semibold">{cartItem?.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleIncreaseQty}
            disabled={updatingType !== null}
          >
            {updatingType === "increase" ? (
              <Loader2 className="animate-spin w-4 h-4 text-gray-600" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">${total}</p>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 hover:text-black transition disabled:opacity-50"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="animate-spin w-5 h-5 text-black" />
          ) : (
            <Trash className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
