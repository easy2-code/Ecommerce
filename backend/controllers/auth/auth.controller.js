import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";

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
  try {
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};
