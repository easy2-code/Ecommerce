// models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    image: [String], // array of image URLs
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", productSchema);

export default Products;
