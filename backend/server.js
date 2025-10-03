// 🚀 Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// 🛢️ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected.."))
  .catch((error) => console.log("❌ DB Error:", error));

// ⚙️ Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 CORS Middleware (Allow Frontend -> Backend requests)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
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

// 🍪 Middleware
app.use(cookieParser());
app.use(express.json());

// ▶️ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
