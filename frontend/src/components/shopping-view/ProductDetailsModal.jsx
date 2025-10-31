import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { brandOptionMap, categoryOptionMap } from "@/config";
import { Star } from "lucide-react";

export default function ProductDetailsModal({
  open,
  setOpen,
  productDetails,
  isLoading,
}) {
  if (!productDetails && !isLoading) return null;

  // Example average rating & total reviews (replace with real data if available)
  const averageRating = 4.2;
  const totalReviews = 10;

  // Function to render filled/empty stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i <= Math.floor(rating) ? "text-black fill-black" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
       max-w-[95vw] sm:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw]
       bg-white rounded-2xl p-4 sm:p-10
       shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden"
      >
        {/* LEFT: Product image */}
        <div className="relative flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden p-3">
          {productDetails?.salePrice > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-md shadow-md z-10">
              On Sale
            </Badge>
          )}
          <img
            src={
              Array.isArray(productDetails?.image)
                ? productDetails?.image[0]
                : productDetails?.image
            }
            alt={productDetails?.title}
            className="w-full h-auto max-h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col max-h-[80vh] overflow-y-auto pr-2 space-y-5">
          <DialogHeader className="px-0">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              {productDetails?.title || "Loading..."}
            </DialogTitle>
          </DialogHeader>

          {/* Category and Brand */}
          <div className="flex flex-wrap gap-3">
            {productDetails?.category && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {categoryOptionMap[productDetails?.category] ||
                  productDetails?.category}
              </Badge>
            )}
            {productDetails?.brand && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {brandOptionMap[productDetails?.brand] || productDetails?.brand}
              </Badge>
            )}
          </div>

          {/* Price + Rating */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {productDetails?.salePrice > 0 ? (
                <>
                  <span className="text-3xl font-bold text-green-600">
                    ${productDetails?.salePrice}
                  </span>
                  <span className="text-lg line-through text-gray-400">
                    ${productDetails?.price}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ${productDetails?.price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-sm text-gray-600">
                ({averageRating.toFixed(1)})
              </span>
            </div>
          </div>

          {/* Description */}
          {productDetails?.description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {productDetails.description}
            </p>
          )}

          {/* Stock info */}
          <div>
            {productDetails?.totalStock > 0 ? (
              <span className="text-sm text-green-600 font-semibold">
                In Stock ({productDetails.totalStock} available)
              </span>
            ) : (
              <span className="text-sm text-red-500 font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Fixed position buttons + Reviews stay inside the same scrollable container */}
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 mt-4">
            <div className="flex">
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white text-base py-5 rounded-lg"
                disabled={productDetails?.totalStock === 0}
              >
                Add to Cart
              </Button>
            </div>

            <Separator className="my-2" />

            {/* Reviews Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Reviews
                </h3>
                <span className="text-sm text-gray-500">
                  {totalReviews} reviews
                </span>
              </div>

              {[...Array(totalReviews)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${i + 1}`}
                    />
                    <AvatarFallback>U{i + 1}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm">
                        User {i + 1}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`h-4 w-4 ${
                              starIndex < 4
                                ? "text-black fill-black"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Great product! Really happy with the quality and design.
                    </p>
                  </div>
                </div>
              ))}

              {/* Review input */}
              <div className="mt-4 pt-3 border-t border-gray-200 mb-10">
                <h4 className="text-sm font-semibold mb-2 text-gray-800">
                  Write a Review
                </h4>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-5 w-5 text-gray-300 cursor-pointer hover:text-black transition-colors"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400 placeholder-gray-400"
                  />
                  <Button className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm rounded-lg">
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
