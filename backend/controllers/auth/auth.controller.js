import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Register User function
export const registerUser = async (req, res) => {
  // console.log("Registration attempt:", req.body);

  const { userName, email, password } = req.body;

  // Validate required fields
  if (!userName || !email || !password) {
    // console.log("Missing fields:", { userName, email, password });
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log("User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      // console.log("Username already taken:", userName);
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // console.log("✅ User registered successfully:", newUser.email);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login function
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Optional: generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
