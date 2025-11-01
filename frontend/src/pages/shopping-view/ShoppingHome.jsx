// pages/shopping-view/ShoppingHome.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  BabyIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import ProductDetailsModal from "@/components/shopping-view/ProductDetailsModal";

// ✅ Import local images
import img1 from "@/assets/Home-Page-Images/1.jpg";
import img2 from "@/assets/Home-Page-Images/2.jpg";
import img3 from "@/assets/Home-Page-Images/3.jpg";
import img4 from "@/assets/Home-Page-Images/4.jpg";
import img5 from "@/assets/Home-Page-Images/5.jpg";

// ✅ Import Brand Logos
import nikeLogo from "@/assets/Brand-logs/nike.png";
import adidasLogo from "@/assets/Brand-logs/adidas.png";
import pumaLogo from "@/assets/Brand-logs/pumma.png";
import levisLogo from "@/assets/Brand-logs/levis.png";
import zaraLogo from "@/assets/Brand-logs/zara.png";
import hmLogo from "@/assets/Brand-logs/HM.png";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/store/shop/cart-slice";

export default function ShoppingHome() {
  const images = [img1, img2, img3, img4, img5];
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isProductListLoading } = useSelector(
    (state) => state.shopProducts
  );
  const intervalRef = React.useRef(null);
  const [visibleCount, setVisibleCount] = useState(20); // initially 20
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingProductIds, setAddingProductIds] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ Auto change image every 4 seconds (single, clean effect)
  useEffect(() => {
    if (intervalRef.current) return; // Prevent duplicate intervals

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [images.length]);

  // ✅ Fetch all products when the page loads
  useEffect(() => {
    dispatch(fetchAllFilteredProducts());
  }, [dispatch]);

  // ✅ Categories (icons + labels + paths)
  const categoriesWithIcons = [
    {
      id: "men",
      label: "Men",
      icon: ShirtIcon,
      path: "/shop/listing?category=men",
    },
    {
      id: "women",
      label: "Women",
      icon: CloudLightning,
      path: "/shop/listing?category=women",
    },
    {
      id: "kids",
      label: "Kids",
      icon: BabyIcon,
      path: "/shop/listing?category=kids",
    },
    {
      id: "accessories",
      label: "Accessories",
      icon: WatchIcon,
      path: "/shop/listing?category=accessories",
    },
    {
      id: "footwear",
      label: "Footwear",
      icon: UmbrellaIcon,
      path: "/shop/listing?category=footwear",
    },
  ];

  // ✅ Brands (with white background logos)
  const brands = [
    {
      id: "nike",
      label: "Nike",
      img: nikeLogo,
    },
    {
      id: "adidas",
      label: "Adidas",
      img: adidasLogo,
    },
    {
      id: "puma",
      label: "Puma",
      img: pumaLogo,
    },
    {
      id: "levi",
      label: "Levi's",
      img: levisLogo,
    },
    {
      id: "zara",
      label: "Zara",
      img: zaraLogo,
    },
    {
      id: "h&m",
      label: "H&M",
      img: hmLogo,
    },
  ];

  const handleAddToCart = async (productId) => {
    if (!user?.id) {
      toast.error("Please login to add items to cart ❌");
      return;
    }

    setAddingProductIds((prev) => [...prev, productId]);

    try {
      const payload = await dispatch(
        addToCart({ userId: user.id, productId, quantity: 1 })
      ).unwrap();

      if (payload?.success) {
        toast.success("Item added to cart 🛒", {
          description: payload.message || "Check your cart to review items.",
        });
      } else {
        toast.error(payload?.message || "Failed to add item ❌");
      }
    } catch (err) {
      toast.error(err || "Something went wrong ❌");
    } finally {
      setAddingProductIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div>
      {/* ✅ Image Slideshow */}
      <div className="w-full h-screen overflow-hidden relative">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Categories Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            Shop by Category
          </h2>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categoriesWithIcons.map((categoryItem) => (
                <Card
                  key={categoryItem.id}
                  onClick={() => navigate(categoryItem.path)}
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white w-28 h-28 flex justify-center items-center"
                >
                  <CardContent className="flex flex-col justify-center items-center p-3">
                    <categoryItem.icon className="w-8 h-8 mb-2 text-primary" />
                    <span className="font-semibold text-gray-700 text-sm text-center">
                      {categoryItem.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Brands Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Shop by Brand</h2>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {brands.map((brand) => (
                <Card
                  key={brand.id}
                  onClick={() =>
                    navigate(
                      `/shop/listing?brand=${encodeURIComponent(brand.id)}`
                    )
                  }
                  className="cursor-pointer hover:shadow-md transition-shadow bg-gray-50 w-28 h-28 flex justify-center items-center"
                >
                  <CardContent className="flex flex-col justify-center items-center p-3">
                    <img
                      src={brand.img}
                      alt={brand.label}
                      className="w-12 h-12 object-contain mb-2"
                    />

                    <span className="font-semibold text-gray-700 text-sm text-center">
                      {brand.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Products Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-center mb-8 text-gray-800">
            Latest Products
          </h2>

          {isProductListLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 rounded-lg p-4"
                >
                  <div className="bg-gray-200 h-40 rounded mb-3"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : productList && productList.length > 0 ? (
            <div className="flex justify-center">
              <div
                className={`grid gap-6 ${
                  productList.length === 1
                    ? "grid-cols-1"
                    : productList.length === 2
                    ? "grid-cols-2"
                    : productList.length === 3
                    ? "grid-cols-3"
                    : productList.length === 4
                    ? "grid-cols-4"
                    : "grid-cols-5"
                }`}
              >
                {productList.slice(0, visibleCount).map((product) => {
                  const imageSrc = Array.isArray(product?.image)
                    ? product.image[0]
                    : product?.image;

                  const isOutOfStock = product?.totalStock === 0;
                  const saleActive = product?.salePrice > 0;

                  return (
                    <div
                      key={product._id}
                      className="w-full max-w-sm mx-auto group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      {/* ✅ Product Image */}
                      <div
                        className="relative overflow-hidden cursor-pointer"
                        onClick={() => openProductModal(product)}
                      >
                        <img
                          src={imageSrc || "https://via.placeholder.com/300"}
                          alt={product?.title}
                          className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ${
                            isOutOfStock ? "opacity-60" : ""
                          }`}
                        />

                        {/* ✅ Sale Badge */}
                        {saleActive && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* ✅ Product Details */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 h-14">
                          {product?.title}
                        </h3>

                        <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {product?.category || "General"}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {product?.brand || "Unknown"}
                          </span>
                        </div>

                        {/* ✅ Price */}
                        <div className="flex items-center gap-2 mb-2">
                          {saleActive ? (
                            <>
                              <span className="text-xl font-bold text-gray-900">
                                ${product.salePrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              ${product?.price}
                            </span>
                          )}
                        </div>

                        {/* ✅ Stock Info */}
                        <p
                          className={`text-sm font-medium ${
                            isOutOfStock ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : `In Stock: ${product?.totalStock}`}
                        </p>

                        {/* ✅ Add To Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product._id)}
                          className="w-full mt-4 py-2 px-4 text-white font-medium flex items-center justify-center gap-2 bg-black hover:bg-gray-800"
                          disabled={
                            isOutOfStock ||
                            addingProductIds.includes(product._id)
                          }
                        >
                          {addingProductIds.includes(product._id) && (
                            <Spinner className="h-4 w-4" />
                          )}
                          {isOutOfStock
                            ? "Unavailable"
                            : addingProductIds.includes(product._id)
                            ? "Adding..."
                            : "Add to cart"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          )}
        </div>
        {productList && visibleCount < productList.length && (
          <div className="flex justify-center mt-6">
            <Button
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                setLoadingMore(true);
                setTimeout(() => {
                  setVisibleCount((prev) => prev + 8); // show 8 more
                  setLoadingMore(false);
                }, 500);
              }}
              disabled={loadingMore}
            >
              {loadingMore && <Spinner className="w-4 h-4" />}
              Show More
            </Button>
          </div>
        )}
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          open={modalOpen}
          setOpen={setModalOpen}
          productDetails={selectedProduct}
          handleAddtoCart={handleAddToCart}
        />
      )}
    </div>
  );
}
