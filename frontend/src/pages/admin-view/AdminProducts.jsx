import ProductImageUpload from "@/components/admin-view/ProductImageUpload";
import CommonForm from "@/components/common/CommonForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElement } from "@/config";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};
import React, { Fragment, useState } from "react";

export default function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  function onSubmit() {}

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => setOpenCreateProductDialog(true)}
        >
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>
      {/* Create product drawer */}
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={(isOpen) => setOpenCreateProductDialog(isOpen)}
      >
        <SheetContent
          side="right"
          className="overflow-auto bg-white shadow-lg p-6 sm:w-[480px]"
        >
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-xl font-semibold text-gray-800">
              Add New Product
            </SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new product to your store.
            </SheetDescription>
          </SheetHeader>

          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
          />

          <div className="py-4">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElement}
              buttonText="Add Product"
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
