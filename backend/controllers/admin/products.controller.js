import { imageUploadUtil } from "../../helpers/cloudinary.js";
import Products from "../../models/product.model.js";

// ✅ Upload image to Cloudinary
export const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;

    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while uploading image",
    });
  }
};

// ✅ Add a new product (with server-side validation)
export const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    // 🔍 1. Required field validation
    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !brand?.trim() ||
      !price ||
      !totalStock
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, description, category, brand, price, or totalStock",
      });
    }

    // 🔍 2. Validate price/stock types
    const numericPrice = parseFloat(price);
    const numericSalePrice = salePrice ? parseFloat(salePrice) : null;
    const numericStock = parseInt(totalStock, 10);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (numericSalePrice && numericSalePrice > numericPrice) {
      return res.status(400).json({
        success: false,
        message: "Sale price cannot exceed original price",
      });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Total stock must be a non-negative integer",
      });
    }

    // 🔍 3. Image check
    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // ✅ 4. Create and save product
    const newlyCreatedProduct = new Products({
      image,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      brand: brand.trim(),
      price: numericPrice,
      salePrice: numericSalePrice,
      totalStock: numericStock,
    });

    await newlyCreatedProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// ✅ Fetch all products
export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Products.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    // console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ✅ Edit a product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Products.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    // console.error("Edit product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit product",
    });
  }
};

// ✅ Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    // console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
