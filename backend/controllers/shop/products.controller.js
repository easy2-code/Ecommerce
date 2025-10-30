// controller/shop/products.controller.js

import Products from "../../models/product.model.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
