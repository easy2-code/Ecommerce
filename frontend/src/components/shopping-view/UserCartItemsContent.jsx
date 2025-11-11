import React, { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash, Loader2 } from "lucide-react";

export default function UserCartItemsContent({
  cartItem,
  handleIncrement,
  handleDecrement,
  handleDelete,
}) {
  const [updatingType, setUpdatingType] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageSrc = Array.isArray(cartItem?.productId?.image)
    ? cartItem.productId.image[0]
    : cartItem?.productId?.image;

  const price =
    cartItem?.productId?.salePrice > 0
      ? cartItem?.productId?.salePrice
      : cartItem?.productId?.price;

  const total = (price * cartItem?.quantity).toFixed(2);

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
            onClick={() => {
              setUpdatingType("decrease");
              handleDecrement(cartItem).finally(() => setUpdatingType(null));
            }}
            disabled={updatingType === "decrease" || cartItem.quantity <= 1}
          >
            {updatingType === "decrease" ? (
              <Loader2 className="animate-spin w-4 h-4 text-gray-600" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </Button>

          <span className="font-semibold">{cartItem?.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              setUpdatingType("increase");
              handleIncrement(cartItem).finally(() => setUpdatingType(null));
            }}
            disabled={updatingType === "increase"} // ✅ removed isMaxStock
          >
            {updatingType === "increase" ? (
              <Loader2 className="animate-spin w-4 h-4 text-gray-600" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">${total}</p>
        <button
          onClick={() => {
            setIsDeleting(true);
            handleDelete(cartItem).finally(() => setIsDeleting(false));
          }}
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
