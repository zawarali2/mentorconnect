const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Avatar color palette
const avatarColors = ["#e07a5f", "#3d405b", "#81b29a", "#f2cc8f", "#e07a5f"];

/**
 * POST /api/auth/signup
 * Register a new mentor account
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, university } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Count existing users for avatar color
    const userCount = await User.countDocuments();
    const avatarColor = avatarColors[userCount % avatarColors.length];

    // Create user (password is hashed automatically by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      university: university || "",
      role: "mentor",
      avatarColor,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Account created successfully!",
      user,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
    res.status(500).json({ message: "Server error during signup." });
  }
});

/**
 * POST /api/auth/login
 * Mentor login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful!",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated mentor
 */
router.get("/me", protect, async (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
