// controller/shop/products.controller.js
import Products from "../../models/product.model.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, sort, search } = req.query;

    const query = {};

    // Enhanced validation
    if (category) {
      const categoryArray = category
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (categoryArray.length > 0) {
        query.category = { $in: categoryArray };
      }
    }

    if (brand) {
      const brandArray = brand
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (brandArray.length > 0) {
        query.brand = { $in: brandArray };
      }
    }

    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    let productsQuery = Products.find(query);

    // Improved sorting with validation
    const sortOptions = {
      "price-lowtohigh": { price: 1 },
      "price-hightolow": { price: -1 },
      "title-atoz": { title: 1 },
      "title-ztoa": { title: -1 },
    };

    const sortConfig = sortOptions[sort] || { title: 1 };

    if (sort?.includes("title")) {
      productsQuery = productsQuery.collation({ locale: "en" });
    }

    productsQuery = productsQuery.sort(sortConfig);

    const products = await productsQuery.lean();

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error("❌ getFilteredProducts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching products.",
    });
  }
};
