import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AdminOrderDetailsView from "./AdminOrderDetailsView";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const dispatch = useDispatch();
  const { isLoading, orderList } = useSelector((state) => state.adminOrder);

  // Fetch all orders for admin
  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleViewDetails = (order) => {
    setSelectedOrder(null); // reset first
    setTimeout(() => setSelectedOrder(order), 0); // ensure re-render
    setOpenDetailsDialog(true);
  };

  const getStatusBadge = (status) => {
    const baseClass =
      "text-white px-3 py-1 rounded-md shadow-md text-center inline-block min-w-[100px]";

    if (!status)
      return <Badge className={`bg-gray-500 ${baseClass}`}>Unknown</Badge>;

    const statusColors = {
      pending: "bg-yellow-500", // Pending → Yellow
      "in process": "bg-orange-500", // In Process → Orange
      "in shipping": "bg-blue-500", // In Shipping → Blue
      rejected: "bg-red-500", // Rejected → Red
      delivered: "bg-green-500", // Delivered → Green
    };

    const colorClass = statusColors[status.toLowerCase()] || "bg-gray-500";

    return (
      <Badge className={`${colorClass} ${baseClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status) => {
    const baseClass =
      "text-white px-3 py-1 rounded-md shadow-md text-center inline-block min-w-[100px]";
    const colorClass = (() => {
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
    })();
    return (
      <Badge className={`${colorClass} ${baseClass}`}>{status || "—"}</Badge>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(orderList.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = orderList.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-6" />
          </div>
        ) : orderList.length === 0 ? (
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
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell>
                      {getPaymentBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      ${order.totalAmount || order.total_amount || 0}
                    </TableCell>
                    <TableCell>
                      {/* Only Button here */}
                      <Button onClick={() => handleViewDetails(order)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Single Dialog outside the table */}
            {selectedOrder && (
              <Dialog
                open={openDetailsDialog}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenDetailsDialog(false);
                    setSelectedOrder(null);
                  }
                }}
              >
                <DialogContent className="sm:max-w-[750px] bg-gradient-to-br from-white to-gray-50 shadow-2xl p-8 rounded-3xl">
                  <AdminOrderDetailsView
                    order={selectedOrder}
                    onClose={() => {
                      setOpenDetailsDialog(false);
                      setSelectedOrder(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}

            {/* Pagination */}
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
