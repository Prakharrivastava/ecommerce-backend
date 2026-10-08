import {User} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";

// Helper: JWT Token Generator
const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });
};

// @desc    Register / Signin new user
// @route   POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields.", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email.", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    return res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      success: true,
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration.", error: error.message, success: false });
  }
};

// @desc    Verify user email
// @route   POST /api/user/verify-email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Invalid or missing token.", success: false });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Verification link is invalid or has expired.", success: false });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error during email verification.", error: error.message, success: false });
  }
};

// @desc    Login user
// @route   POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials.", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials.", success: false });
    }

    //if (!user.isVerified) {
    // return res.status(401).json({ message: "Please verify your email address before logging in.", success: false });
    // }

    // Line 97 ko isse replace karein:
const authToken = jwt.sign(
  { id: user._id }, 
  process.env.SECRET_KEY, 
  { expiresIn: "1d" }
);

    return res.status(200).json({
      message: "Login successful.",
      token: authToken,
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login.", error: error.message, success: false });
  }
};

// @desc    Logout user / Clear session
// @route   POST /api/user/logout
export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully.", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error during logout.", success: false });
  }
};

// @desc    Forgot Password (Generate & Save OTP)
// @route   POST /api/user/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist.", success: false });
    }

    // 6-Digit OTP Generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000; // 10 mins validity
    await user.save();

    // NodeMailer logic can be attached here to send 'otp' via email
    return res.status(200).json({
      message: "OTP sent successfully to your email.",
      success: true,
      otp, // Demo purpose ke liye payload me return kiya h
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error in forgot password.", error: error.message, success: false });
  }
};

// @desc    Verify OTP
// @route   POST /api/user/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP.", success: false });
    }

    return res.status(200).json({ message: "OTP verified successfully.", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error verifying OTP.", error: error.message, success: false });
  }
};

// @desc    Change / Reset Password
// @route   POST /api/user/change-password
export const changePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid request or expired session.", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully. Please login with new password.", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error changing password.", error: error.message, success: false });
  }
};

// @desc    Get current user profile data
// @route   GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id || req.user?.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching profile.", error: error.message, success: false });
  }
};

// @desc    Get user by specific ID (Admin / Direct view)
// @route   GET /api/user/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching user.", error: error.message, success: false });
  }
};

// @desc    Get all users list (Admin view)
// @route   GET /api/user/all
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching users.", error: error.message, success: false });
  }
};

// @desc    Update profile (Name & Profile Picture)
// @route   PUT /api/user/update
export const updateUser = async (req, res) => {
  try {
    const userId = req.id || req.user?.id;
    const { name } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    if (name) user.name = name;

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_pics",
      });
      user.profilePic = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during profile update.",
      error: error.message,
      success: false,
    });
  }
};

// @desc    Save or update user address
// @route   POST /api/user/address/save
export const saveAddress = async (req, res) => {
  try {
    const userId = req.id || req.user?.id;
    const { fullName, phone, street, city, pinCode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Assuming you want to save address fields directly to the user model or an address sub-document
    user.address = `${street}, ${city} - ${pinCode}`;
    user.phone = phone || user.phone;
    await user.save();

    return res.status(200).json({
      message: "Address saved to profile!",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save address", error: error.message, success: false });
  }
};