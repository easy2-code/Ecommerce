// components/shopping-view/ShoppingListing.jsx
import ProductDetailsModal from "@/components/shopping-view/ProductDetailsModal";
import ProductFilter from "@/components/shopping-view/ProductFilter";
import ShoppingProductTile from "@/components/shopping-view/ShoppingProductTile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions, filterOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import {
  ArrowUpDownIcon,
  BrushCleaning,
  Loader2,
  PackageIcon,
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function ShoppingListing() {
  const dispatch = useDispatch();
  const {
    productList,
    productDetails,
    isProductListLoading,
    isProductDetailsLoading,
    error,
  } = useSelector((state) => state.shopProducts);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  // Use ref to track if it's initial mount
  const isInitialMount = useRef(true);
  const previousFilters = useRef({ category: [], brand: [] });
  const previousSort = useRef("title-atoz");

  // Validate and sanitize URL parameters
  const getValidatedParams = useCallback(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const sortParam = searchParams.get("sort");

    const validCategories = categoryParam
      ? categoryParam
          .split(",")
          .filter((cat) => filterOptions.category.some((opt) => opt.id === cat))
      : [];

    const validBrands = brandParam
      ? brandParam
          .split(",")
          .filter((brand) =>
            filterOptions.brand.some((opt) => opt.id === brand)
          )
      : [];

    const validSort = sortOptions.some((opt) => opt.id === sortParam)
      ? sortParam
      : "title-atoz";

    return {
      category: validCategories,
      brand: validBrands,
      sort: validSort,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState({
    category: [],
    brand: [],
  });
  const [sort, setSort] = useState("title-atoz");

  // Initialize from URL on component mount
  useEffect(() => {
    const validatedParams = getValidatedParams();
    setFilters({
      category: validatedParams.category,
      brand: validatedParams.brand,
    });
    setSort(validatedParams.sort);

    // Immediately fetch products based on URL parameters
    dispatch(fetchAllFilteredProducts(validatedParams));

    // Mark mount complete
    isInitialMount.current = false;
  }, [dispatch, getValidatedParams]);

  // Optimized: Only update URL and fetch when filters/sort actually change
  useEffect(() => {
    // Check if filters or sort actually changed
    const filtersChanged =
      JSON.stringify(filters.category) !==
        JSON.stringify(previousFilters.current.category) ||
      JSON.stringify(filters.brand) !==
        JSON.stringify(previousFilters.current.brand);

    const sortChanged = sort !== previousSort.current;

    if (!filtersChanged && !sortChanged) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();

      if (filters.category.length > 0) {
        params.set("category", filters.category.join(","));
      } else {
        params.delete("category");
      }

      if (filters.brand.length > 0) {
        params.set("brand", filters.brand.join(","));
      } else {
        params.delete("brand");
      }

      if (sort && sort !== "title-atoz") {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }

      // Only update URL if it's different from current
      const currentParamsString = searchParams.toString();
      const newParamsString = params.toString();

      if (currentParamsString !== newParamsString) {
        setSearchParams(params);
      }

      // Only dispatch if filters/sort actually changed
      dispatch(fetchAllFilteredProducts({ ...filters, sort }));

      // Update previous values
      previousFilters.current = { ...filters };
      previousSort.current = sort;
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, sort, dispatch, setSearchParams, searchParams]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId)).then(() =>
      setOpen(true)
    );
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!user?.id) {
      toast.error("Please login to add items to cart ❌");
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    )
      .unwrap()
      .then((payload) => {
        // payload is the full backend response: { success, message, cart }
        if (payload?.success) {
          dispatch(fetchCartItems(user.id));
          toast.success("Item added to cart 🛒", {
            description: payload.message || "Check your cart to review items.",
          });
        } else {
          toast.error(payload?.message || "Failed to add item ❌");
        }
      })
      .catch((err) => {
        // unwrap will throw the rejectWithValue content or error message
        toast.error(err || "Something went wrong ❌");
      });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            {isProductListLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {productList?.length || 0} Products
              </span>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={isProductListLoading}
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSortChange}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="m-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Render products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {isProductListLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))
          ) : productList?.length ? (
            productList.map((product) => (
              <ShoppingProductTile
                handleGetProductDetails={handleGetProductDetails}
                key={product._id}
                product={product}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <PackageIcon className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="text-gray-400 text-lg mt-4">No products found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>

      <ProductDetailsModal
        open={open}
        setOpen={setOpen}
        productDetails={productDetails}
        isLoading={isProductDetailsLoading}
        handleAddtoCart={handleAddtoCart}
      />
    </div>
  );
}
