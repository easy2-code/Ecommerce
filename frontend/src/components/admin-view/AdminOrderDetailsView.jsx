import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  getAllOrdersForAdmin,
  updateOrderStatusForAdmin,
} from "@/store/admin/order-slice";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import CommonForm from "../common/CommonForm";
import { TableCell } from "../ui/table";

export default function AdminOrderDetailsView({ order, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ status: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (order?.orderStatus) {
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

  useEffect(() => {
    if (order) setIsClosing(false); // Reset closing animation when a new order is opened
  }, [order]);

  async function handleUpdateStatus(event) {
    event.preventDefault();
    if (!order?._id || !formData.status) return;

    try {
      setIsUpdating(true);

      const response = await dispatch(
        updateOrderStatusForAdmin({
          orderId: order._id,
          status: formData.status,
        })
      ).unwrap();

      toast.success(
        `✅ Order #${order._id} status updated to "${formData.status}".`
      );

      // Immediately close the modal
      onClose?.();

      // Refresh order list AFTER closing modal
      await dispatch(getAllOrdersForAdmin()).unwrap();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Something went wrong while updating order status.");
    } finally {
      setIsUpdating(false);
    }
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
      pending: "bg-yellow-500", // Pending → Yellow
      "in process": "bg-orange-500", // In Process → Orange
      "in shipping": "bg-blue-500", // In Shipping → Blue
      rejected: "bg-red-500", // Rejected → Red
      delivered: "bg-green-500", // Delivered → Green
    };

    return map[status.toLowerCase()] || "bg-gray-500";
  };

  return (
    <div
      className={`max-h-[80vh] overflow-y-auto p-4 space-y-6 transform transition-all duration-500 ${
        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* ===================== Order Summary ===================== */}
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

      {/* ===================== Order Items ===================== */}
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
                          src={item.productId.image[0]}
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

      {/* ===================== Shipping Info ===================== */}
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

      {/* ===================== Update Order Status ===================== */}
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
              value: formData.status,
              onChange: (e) =>
                setFormData({ ...formData, status: e.target.value }),
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={
            isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Updating...
              </span>
            ) : (
              "Update Order Status"
            )
          }
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
