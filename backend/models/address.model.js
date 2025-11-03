// models/address.model.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    note: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
