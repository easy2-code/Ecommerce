import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import CommonForm from "../common/CommonForm";
import { TableCell } from "../ui/table";

export default function AdminOrderDetailsView({ order, onClose }) {
  const [formData, setFormData] = useState({ status: "" });

  useEffect(() => {
    if (order?.orderStatus) {
      // Map backend status to SelectItem id
      const statusMap = {
        pending: "Pending",
        "in process": "In Process",
        "in shipping": "In Shipping",
        rejected: "Rejected",
        delivered: "Delivered",
      };

      setFormData({
        status: statusMap[order.orderStatus.toLowerCase()] || "Pending",
      });
    } else {
      setFormData({ status: "" });
    }
  }, [order]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    // TODO: Add API call to update status
    console.log("Update status to:", formData.status);
  }

  if (!order) return null;

  const {
    _id,
    orderDate,
    orderUpdateDate,
    orderStatus,
    paymentStatus,
    paymentMethod,
    payerId,
    paymentId,
    totalAmount,
    cartItems = [],
    addressInfo = {},
  } = order;

  const shippingInfo = addressInfo || {};

  const getBadgeColor = (status) => {
    if (!status) return "bg-gray-500";
    const map = {
      confirmed: "bg-green-500",
      pending: "bg-yellow-400",
      cancelled: "bg-red-500",
      shipped: "bg-blue-500",
      delivered: "bg-teal-500",
      processing: "bg-orange-500",
      paid: "bg-green-600",
      unpaid: "bg-red-600",
    };
    return map[status.toLowerCase()] || "bg-gray-500";
  };

  // console.log(cartItems);

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4 space-y-6">
      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Order Summary
          </h2>
          <Badge
            className={`${getBadgeColor(
              orderStatus
            )} text-white px-4 py-1 rounded-full`}
          >
            {orderStatus || "Unknown"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-600">Order ID</p>
            <Label className="text-gray-800">{_id}</Label>
          </div>
          <div>
            <p className="font-medium text-gray-600">Total Amount</p>
            <Label className="text-lg font-semibold text-gray-900">
              ${totalAmount?.toFixed(2) || "0.00"}
            </Label>
          </div>
          <div>
            <p className="font-medium text-gray-600">Order Date</p>
            <Label>
              {orderDate ? new Date(orderDate).toLocaleString() : "N/A"}
            </Label>
          </div>
          <div>
            <p className="font-medium text-gray-600">Last Updated</p>
            <Label>
              {orderUpdateDate
                ? new Date(orderUpdateDate).toLocaleString()
                : "—"}
            </Label>
          </div>
          <div>
            <p className="font-medium text-gray-600">Payment Method</p>
            <Label>{paymentMethod || "—"}</Label>
          </div>
          <div>
            <p className="font-medium text-gray-600">Payment Status</p>
            <Badge
              className={`${getBadgeColor(
                paymentStatus
              )} text-white px-3 py-1 rounded-full`}
            >
              {paymentStatus || "—"}
            </Badge>
          </div>
          {payerId && (
            <div>
              <p className="font-medium text-gray-600">Payer ID</p>
              <Label>{payerId}</Label>
            </div>
          )}
          {paymentId && (
            <div>
              <p className="font-medium text-gray-600">Payment ID</p>
              <Label>{paymentId}</Label>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          🛍️ Order Items
        </h2>

        {cartItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartItems.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <TableCell className="px-4 py-2 flex items-center gap-3">
                      {item.productId?.image?.[0] ? (
                        <img
                          src={item.productId.image[0]} // ✅ correct property
                          alt={item.productId?.title || "Product"}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                      <span className="text-gray-800 font-medium">
                        {item.productId?.title || "Product"}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-2">
                      {item.quantity || 1}
                    </TableCell>

                    <TableCell className="px-4 py-2 text-right font-semibold text-gray-800">
                      $
                      {item.productId?.price?.toFixed(2) ||
                        item.price?.toFixed(2) ||
                        0}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No items found.</p>
        )}
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          🚚 Shipping Information
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-600">Address</p>
            <p className="text-gray-800">{shippingInfo.address || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">City</p>
            <p className="text-gray-800">{shippingInfo.city || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Pincode</p>
            <p className="text-gray-800">{shippingInfo.pincode || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Phone</p>
            <p className="text-gray-800">{shippingInfo.phone || "—"}</p>
          </div>
          {shippingInfo.notes && (
            <div className="col-span-2">
              <p className="font-medium text-gray-600">Note</p>
              <p className="text-gray-800">{shippingInfo.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Order Status Form */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          ⚙️ Update Order Status
        </h2>
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "Pending", label: "Pending" },
                { id: "In Process", label: "In Process" },
                { id: "In Shipping", label: "In Shipping" },
                { id: "Rejected", label: "Rejected" },
                { id: "Delivered", label: "Delivered" },
              ],
              value: formData.status, // ✅ current value
              onChange: (e) =>
                setFormData({ ...formData, status: e.target.value }),
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Update Order Status"}
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
