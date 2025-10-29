// components/admin-view/AdminProductTile.jsx
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";

export default function AdminProductTile({ product, onEdit, onDelete }) {
  const imageSrc = Array.isArray(product?.image)
    ? product.image[0]
    : product?.image;

  return (
    <Card className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={product?.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product?.salePrice > 0 && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
            Sale
          </span>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {product?.title}
        </h2>
        <div className="flex justify-between items-center">
          <div>
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-gray-400 text-sm"
                  : "text-gray-800 font-semibold"
              }`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-black font-bold ml-2">
                ${product?.salePrice}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            Stock: {product?.totalStock}
          </span>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="flex justify-end gap-2 border-t p-3 bg-gray-50">
        <Button onClick={() => onEdit(product)}>
          <Edit size={16} />
          Edit
        </Button>

        <Button onClick={onDelete}>
          <Trash2 size={16} />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
