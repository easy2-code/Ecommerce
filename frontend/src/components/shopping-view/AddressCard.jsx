import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function AddressCard({
  addressInfo,
  onEdit,
  onDelete,
  selectedAddressId,
  setCurrentSelectedAddress,
}) {
  const isSelected = selectedAddressId === addressInfo._id;

  return (
    <Card
      className={`shadow-md border rounded-xl transition-all duration-200 p-2 cursor-pointer
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-lg"
            : "border-gray-200 bg-white hover:shadow-md"
        }
      `}
      onClick={() => setCurrentSelectedAddress(addressInfo)}
    >
      <div className="flex items-start gap-4">
        {/* ✅ Custom selection indicator */}
        <div
          className={`w-5 h-5 flex-shrink-0 rounded-full border-2 transition-all duration-200
            ${
              isSelected
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300 bg-white"
            }
          `}
        />

        {/* Address details */}
        <CardContent className="p-2 space-y-1 text-gray-700 flex-1">
          <p>
            <span className="text-gray-500">🏠 Address:</span>{" "}
            {addressInfo?.address}
          </p>
          <p>
            <span className="text-gray-500">🏙️ City:</span> {addressInfo?.city}
          </p>
          <p>
            <span className="text-gray-500">📮 Pincode:</span>{" "}
            {addressInfo?.pincode}
          </p>
          <p>
            <span className="text-gray-500">📞 Phone:</span>{" "}
            {addressInfo?.phone}
          </p>
          {addressInfo?.notes && (
            <p>
              <span className="text-gray-500">📝 Notes:</span>{" "}
              {addressInfo?.notes}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(addressInfo);
              }}
            >
              ✏️ Edit
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(addressInfo._id);
              }}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
