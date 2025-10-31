// controllers/cart.controller.js
import Cart from "../../models/cart.model.js";

//  Add a product to the user's cart
//  If the cart exists, update quantity if product exists, or add new item
//  If no cart exists for the user, create a new cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate request body
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, and quantity are required.",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if the product is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Product exists: increase quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product does not exist: add as new item
        cart.items.push({ productId, quantity });
      }
    } else {
      // No cart exists: create a new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    // Save cart to database
    await cart.save();

    // Populate product details after saving
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      model: "Product",
      select: "title price image description",
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while adding to cart",
    });
  }
};

//  Fetch all items in a user's cart
//  Populates the product details for each item
export const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price image description", // choose which fields you want
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching cart",
    });
  }
};

//  Update the quantity of a specific cart item
//  If quantity <= 0, remove the item from the cart
export const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, and quantity are required.",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // ✅ Repopulate product details
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "title price image description salePrice",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating cart",
    });
  }
};

// Delete a specific product from the user's cart
export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Validate request body
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required.",
      });
    }

    const cart = await Cart.findOne({ userId });

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item index
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    // repopulate so frontend gets full product info again
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "title price image description",
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting cart item",
    });
  }
};
