import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/CommonForm";

const initialFormData = {
  status: "",
};

export default function AdminOrderDetailsView() {
  const [formData, setFormData] = useState(initialFormData);

  function handleUpdateStatus(event) {
    event.preventDefault();
  }
  return (
    <DialogContent className={"sm:max-w-[600px]"}>
      <div className="grid gap-6">
        <div className="grid gap-2 mt-5">
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>12345</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>12/10/2025</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>In Progress</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>$1000</Label>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span>Product One</span>
                  <span>$1000</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Info</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>John Doe</span>
                <span>Address</span>
                <span>City</span>
                <span>PinCode</span>
                <span>Phone</span>
                <span>Notes</span>
              </div>
            </div>
          </div>

          <div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    {
                      id: "pending",
                      label: "In Pending",
                    },
                    {
                      id: "inProcess",
                      label: "In Process",
                    },
                    {
                      id: "inShipping",
                      label: "In Shipping",
                    },
                    {
                      id: "rejected",
                      label: "Rejected",
                    },
                    {
                      id: "delivered",
                      label: "In Delivered",
                    },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
