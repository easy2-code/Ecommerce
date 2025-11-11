// 📁 components/shopping-view/ShoppingOrders.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import ShoppingOrderDetailsView from "./ShoppingOrderDetailsView";
import { Spinner } from "../ui/spinner";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";

export default function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // you can change it
  const { user } = useSelector((state) => state.auth);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Use environment variable

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = user?.id || user?._id;

      if (!userId) {
        console.error("No user ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/shop/order/list/${userId}`
        );
        const data = await response.json();
        // console.log(data);

        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const baseClass =
      "text-white px-3 py-1 rounded-md shadow-md text-center inline-block min-w-[100px]";

    if (!status) {
      return <Badge className={`bg-gray-500 ${baseClass}`}>Unknown</Badge>;
    }

    const statusMap = {
      pending: "bg-yellow-500", // Pending → Yellow
      "in process": "bg-orange-500", // In Process → Orange
      "in shipping": "bg-blue-500", // In Shipping → Blue
      rejected: "bg-red-500", // Rejected → Red
      delivered: "bg-green-500", // Delivered → Green
    };

    const colorClass = statusMap[status.toLowerCase()] || "bg-gray-500";

    return (
      <Badge className={`${colorClass} ${baseClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const paymentBadgeBaseClass =
    "text-white px-3 py-1 rounded-md shadow-md text-center inline-block min-w-[100px]";

  const getBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500";
      case "unpaid":
      case "failed":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      case "refunded":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-6" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No orders found.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Order Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedOrders.map((order, index) => (
                  <TableRow key={order._id || index}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${getBadgeColor(
                          order.paymentStatus
                        )} ${paymentBadgeBaseClass}`}
                      >
                        {order.paymentStatus || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${order.totalAmount || order.total_amount || 0}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={setOpenDetailsDialog}
                      >
                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenDetailsDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                        <DialogContent className="sm:max-w-[750px] max-h-[80vh] bg-gradient-to-br from-white to-gray-50 shadow-2xl p-8 rounded-3xl">
                          {selectedOrder ? (
                            <div className="max-h-[70vh] overflow-y-auto pr-2">
                              <ShoppingOrderDetailsView order={selectedOrder} />
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 py-6">
                              Loading...
                            </p>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ✅ Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center py-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(
                            currentPage > 1 ? currentPage - 1 : 1
                          )
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
