// controllers/address.controller.js
import Address from "../../models/address.model.js";

/* -------------------------------
   Add New Address
-------------------------------- */
export const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, note } = req.body;

    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const newAddress = await Address.create({
      userId,
      address,
      city,
      pincode,
      phone,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

/* -------------------------------
   Fetch All Addresses for User
-------------------------------- */
export const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

/* -------------------------------
   Edit / Update Address
-------------------------------- */
export const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { address, city, pincode, phone, note } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { address, city, pincode, phone, note },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      updatedAddress,
    });
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

/* -------------------------------
   Delete Address
-------------------------------- */
export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
