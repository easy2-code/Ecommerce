// components/shopping-view/ShoppingProductTile.jsx:
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionMap, categoryOptionMap } from "@/config";

export default function ShoppingProductTile({
  product,
  handleGetProductDetails,
}) {
  // Get the first image if it's an array
  const imageSrc = Array.isArray(product?.image)
    ? product.image[0]
    : product?.image;

  const isOutOfStock = product?.totalStock === 0;

  return (
    <Card className="w-full max-w-sm mx-auto group hover:shadow-lg transition-all duration-300">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="relative overflow-hidden cursor-pointer"
      >
        {/* Product Image */}
        <img
          src={imageSrc}
          alt={product?.title}
          className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? "opacity-60" : ""
          }`}
        />

        {/* Sale Badge */}
        {product?.salePrice > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
            Sale
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Title */}
        <h2 className="text-lg font-bold mb-2 line-clamp-2 h-14">
          {product?.title}
        </h2>

        {/* Category and Brand */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
            {categoryOptionMap[product?.category] || product?.category}
          </span>
          <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
            {brandOptionMap[product?.brand] || product?.brand}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {product?.salePrice > 0 ? (
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
          {isOutOfStock ? "Out of Stock" : `In Stock: ${product?.totalStock}`}
        </p>
      </CardContent>

      {/* Add to Cart Button */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-black hover:bg-gray-800 text-white"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Unavailable" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
