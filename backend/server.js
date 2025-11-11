import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth/auth.route.js";
import adminProductsRouter from "./routes/admin/products.route.js";
import shopProductsRouter from "./routes/shop/products.route.js";
import shopCartRouter from "./routes/shop/cart.route.js";
import shopAddressRouter from "./routes/shop/address.route.js";
import shopOrderRouter from "./routes/shop/order.route.js";
import adminOrderRouter from "./routes/admin/order.route.js";

dotenv.config({ path: ".env" });

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected.."))
  .catch((error) => console.log("❌ DB Error:", error));

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://loopmart-frontend.vercel.app", // <-- update with your actual Vercel domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// Listen
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
