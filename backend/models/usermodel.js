import mongoose from "mongoose";

// 1. Address Sub-Schema (Multiple addresses support ke liye)
const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 2. Main User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    profilepic: {
      type: String,
      default: "", // Cloudinary image URL
    },
    profilepicPublicID: {
      type: String,
      default: "", // Cloudinary public_id for deletion
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Prevents casing duplicates
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    // Single default address fields (Backward Compatibility ke liye)
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
    phoneNo: {
      type: String,
      default: "",
    },
    // Multiple Saved Addresses List
    addresses: [addressSchema],
  },
  { timestamps: true }
);

// 3. Export Model
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;