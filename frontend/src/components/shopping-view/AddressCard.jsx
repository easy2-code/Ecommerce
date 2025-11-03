// components/shopping-view/AddressCard.jsx
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function AddressCard({ addressInfo, onEdit, onDelete }) {
  return (
    <Card className="shadow-md border rounded-xl hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4 space-y-2 text-gray-700">
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
          <span className="text-gray-500">📞 Phone:</span> {addressInfo?.phone}
        </p>
        {addressInfo?.notes && (
          <p>
            <span className="text-gray-500">📝 Notes:</span>{" "}
            {addressInfo?.notes}
          </p>
        )}

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(addressInfo)}
          >
            ✏️ Edit
          </Button>
          <Button size="sm" onClick={() => onDelete(addressInfo._id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
