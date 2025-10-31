import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { brandOptionMap, categoryOptionMap } from "@/config";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductDetailsModal({
  open,
  setOpen,
  productDetails,
  isLoading,
  handleAddtoCart,
}) {
  if (!productDetails && !isLoading) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Example average rating & total reviews (replace with real data if available)
  const averageRating = 4.2;
  const totalReviews = 10;

  // Get images array from productDetails
  const images = Array.isArray(productDetails?.image)
    ? productDetails.image
    : productDetails?.image
    ? [productDetails.image]
    : [];

  // Function to render filled/empty stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${
            i <= Math.floor(rating) ? "text-black fill-black" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  // Navigation functions
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Reset image index when modal opens/closes or product changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [open, productDetails]);

  const isOutOfStock = productDetails?.totalStock === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
       w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh]
       bg-white rounded-lg sm:rounded-2xl p-3 sm:p-6 lg:p-8
       shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 overflow-hidden"
      >
        {/* LEFT: Product image with navigation */}
        <div className="relative flex flex-col gap-3 sm:gap-4 h-full">
          {/* Main Image Container */}
          <div className="relative flex items-center justify-center bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden p-2 sm:p-3 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex-1">
            {/* Sale Badge */}
            {productDetails?.salePrice > 0 && (
              <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-md shadow-md z-10">
                On Sale
              </Badge>
            )}

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevImage}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 border shadow-lg z-20 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Button>
            )}

            {/* Main Image */}
            <img
              src={images[currentImageIndex]}
              alt={productDetails?.title}
              className="w-full h-auto max-h-[280px] sm:max-h-[330px] lg:max-h-[380px] object-contain rounded-lg"
            />

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextImage}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 border shadow-lg z-20 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-1 sm:gap-2 justify-center overflow-x-auto py-1 sm:py-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 rounded-md overflow-hidden transition-all duration-200 ${
                    index === currentImageIndex
                      ? "border-black border-2 shadow-md"
                      : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Dots for Mobile */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1 sm:gap-2 lg:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-black w-3 sm:w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col max-h-full overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-5">
          <DialogHeader className="px-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              {productDetails?.title || "Loading..."}
            </DialogTitle>
          </DialogHeader>

          {/* Category and Brand */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {productDetails?.category && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 text-xs sm:text-sm"
              >
                {categoryOptionMap[productDetails?.category] ||
                  productDetails?.category}
              </Badge>
            )}
            {productDetails?.brand && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 text-xs sm:text-sm"
              >
                {brandOptionMap[productDetails?.brand] || productDetails?.brand}
              </Badge>
            )}
          </div>

          {/* Price + Rating */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {productDetails?.salePrice > 0 ? (
                <>
                  <span className="text-2xl sm:text-3xl font-bold text-green-600">
                    ${productDetails?.salePrice}
                  </span>
                  <span className="text-base sm:text-lg line-through text-gray-400">
                    ${productDetails?.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ${productDetails?.price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-xs sm:text-sm text-gray-600">
                ({averageRating.toFixed(1)})
              </span>
            </div>
          </div>

          {/* Description */}
          {productDetails?.description && (
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {productDetails.description}
            </p>
          )}

          {/* Stock info */}
          <div>
            {productDetails?.totalStock > 0 ? (
              <span className="text-xs sm:text-sm text-green-600 font-semibold">
                In Stock ({productDetails.totalStock} available)
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-red-500 font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Fixed position buttons + Reviews stay inside the same scrollable container */}
          <div className="flex flex-col gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4">
            <div className="flex">
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white text-sm sm:text-base py-3 sm:py-4 lg:py-5 rounded-lg"
                disabled={isOutOfStock}
                onClick={() => handleAddtoCart(productDetails?._id)}
              >
                {isOutOfStock ? "Unavailable" : "Add to Cart"}
              </Button>
            </div>

            <Separator className="my-1 sm:my-2" />

            {/* Reviews Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Customer Reviews
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  {totalReviews} reviews
                </span>
              </div>

              {[...Array(totalReviews)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0"
                >
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${i + 1}`}
                    />
                    <AvatarFallback className="text-xs">
                      U{i + 1}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        User {i + 1}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              starIndex < 4
                                ? "text-black fill-black"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      Great product! Really happy with the quality and design.
                    </p>
                  </div>
                </div>
              ))}

              {/* Review input */}
              <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 mb-6 sm:mb-10">
                <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-800">
                  Write a Review
                </h4>
                <div className="flex items-center gap-1 mb-1 sm:mb-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 cursor-pointer hover:text-black transition-colors"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-gray-400 placeholder-gray-400"
                  />
                  <Button className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
