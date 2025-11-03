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

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected.."))
  .catch((error) => console.log("❌ DB Error:", error));

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Use official CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
