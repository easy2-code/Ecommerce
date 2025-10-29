import { useEffect, Fragment, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { toast } from "sonner";

const initialFormData = {
  image: null, // will hold the first uploaded image URL or an array
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

export default function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState([]);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  // Update formData.image whenever uploadedImageUrls changes
  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrls, // store array of URLs
      }));
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
    }
  }, [uploadedImageUrls]);

  function onSubmit(event) {
    event.preventDefault();
    dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrls,
      })
    ).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductDialog(false);
        setImageFiles([]); // ✅ was null
        setUploadedImageUrls([]); // ✅ optional, to reset images
        setImageLoadingState([]); // ✅ optional
        setFormData(initialFormData);
        toast.success("Product added successfully 🎉", {
          description: `${formData.title} has been added to your store.`,
        });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // console.log(productList, uploadedImageUrls, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductDialog(true)}>
          Add New Product
        </Button>
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={(isOpen) => setOpenCreateProductDialog(isOpen)}
      >
        <SheetContent
          side="right"
          className="overflow-auto bg-white shadow-lg p-6 sm:w-[480px]"
        >
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new product to your store.
            </SheetDescription>
          </SheetHeader>

          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
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
