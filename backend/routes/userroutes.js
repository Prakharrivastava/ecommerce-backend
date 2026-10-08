import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  verifyOTP,
  changePassword,
  getUserProfile,
  getUserById,
  getAllUsers,
  updateUser,
  saveAddress, // <-- Imported properly here at the top
} from "../controller/userController.js";
import { singleUpload } from "../middleware/multer.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Auth Endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/verify-email", verifyEmail);

// Address Route
router.post("/address/save", isAuthenticated, saveAddress);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);

// User Queries
router.get("/profile", isAuthenticated, getUserProfile);
router.get("/all", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);

// Profile Update
router.put("/update", isAuthenticated, singleUpload, updateUser);

export default router;