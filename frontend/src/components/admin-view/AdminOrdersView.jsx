import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminOrderDetailsView from "./AdminOrderDetailsView";

export default function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>12345</TableCell>
              <TableCell>22/11/2025</TableCell>
              <TableCell>In Process</TableCell>
              <TableCell>$1000</TableCell>
              <TableCell>
                {/* ✅ Correct Dialog usage */}
                <Dialog
                  open={openDetailsDialog}
                  onOpenChange={setOpenDetailsDialog}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpenDetailsDialog(true)}>
                      View Details
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>

                    {/* ✅ Your details component goes here */}
                    <AdminOrderDetailsView
                      onClose={() => setOpenDetailsDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
