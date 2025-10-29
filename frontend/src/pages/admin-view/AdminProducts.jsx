import { useEffect, Fragment, useState } from "react";
import ProductImageUpload from "@/components/admin-view/ProductImageUpload";
import CommonForm from "@/components/common/CommonForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PackageIcon } from "lucide-react"; // or any icon you like
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElement } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} from "@/store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/AdminProductTile";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const initialFormData = {
  image: [],
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
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { productList, isLoading } = useSelector(
    (state) => state.adminProducts
  );

  const dispatch = useDispatch();

  // Keep formData.image in sync with uploadedImageUrls
  useEffect(() => {
    setFormData((prev) => ({ ...prev, image: uploadedImageUrls }));
  }, [uploadedImageUrls]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Submit handler for add/update
  const onSubmit = (event) => {
    event.preventDefault();
    setLoadingAdd(true);

    const action = editingProduct
      ? editProduct({ id: editingProduct._id, updates: formData }) // edit
      : addNewProduct({ ...formData, image: uploadedImageUrls }); // add

    dispatch(action).then((data) => {
      setLoadingAdd(false);

      // ✅ Check payload existence instead of `success`
      if (data?.payload) {
        dispatch(fetchAllProducts());
        setOpenCreateProductDialog(false); // close the sheet
        setImageFiles([]);
        setUploadedImageUrls([]);
        setImageLoadingState([]);
        setFormData(initialFormData);
        setEditingProduct(null);

        toast.success(
          editingProduct
            ? "Product updated successfully 🎉"
            : "Product added successfully 🎉",
          {
            description: `${formData.title} has been saved to your store.`,
          }
        );
      }
    });
  };

  // Show More
  const handleShowMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setLoadingMore(false);
    }, 500);
  };

  // Edit handler
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      image: product.image || [],
    });
    setUploadedImageUrls(product.image || []);
    setImageFiles([]); // reset file uploads
    setOpenCreateProductDialog(true);
  };

  // Delete Product handler
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    dispatch(deleteProduct(productToDelete._id))
      .then((res) => {
        if (res?.payload) {
          toast.success(`Product "${productToDelete.title}" deleted ✅`);
        } else {
          toast.error(`Failed to delete product "${productToDelete.title}" ❌`);
        }
      })
      .finally(() => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      });
  };

  return (
    <Fragment>
      {/* Add / Edit Button */}
      <div className="w-full flex justify-end mb-6">
        <Button
          className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          onClick={() => {
            setEditingProduct(null);
            setFormData(initialFormData);
            setUploadedImageUrls([]);
            setImageFiles([]);
            setOpenCreateProductDialog(true);
          }}
          disabled={loadingAdd}
        >
          {loadingAdd && <Spinner className="w-4 h-4" />}
          {"+ Add New Product"}
        </Button>
      </div>

      {/* Product Grid */}
      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          // Page-level loading spinner
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
            <Spinner className="w-12 h-12 mb-4" />
            <p className="text-center text-lg font-medium">
              Loading products...
            </p>
          </div>
        ) : productList && productList.length > 0 ? (
          productList
            .slice(0, visibleCount)
            .map((item) => (
              <AdminProductTile
                key={item._id || item.id}
                product={item}
                onEdit={handleEditProduct}
                onDelete={() => handleDeleteProduct(item)}
              />
            ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
            <PackageIcon className="w-12 h-12 mb-4" />
            <p className="text-center text-lg font-medium">
              No products found.
            </p>
          </div>
        )}
      </div>

      {/* Show More */}
      {productList && productList.length > visibleCount && (
        <div className="flex justify-center mt-6">
          <Button
            className="cursor-pointer flex items-center gap-2"
            onClick={handleShowMore}
            disabled={loadingMore}
          >
            {loadingMore && <Spinner className="w-4 h-4" />}
            Show More
          </Button>
        </div>
      )}

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      >
        <SheetContent
          side="right"
          className="overflow-auto bg-white shadow-lg p-6 sm:w-[480px]"
        >
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle>
              {editingProduct ? "Update Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              {editingProduct
                ? "Update the details of your product below."
                : "Fill in the details below to add a new product to your store."}
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
              buttonText={editingProduct ? "Update Product" : "Add Product"}
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}
