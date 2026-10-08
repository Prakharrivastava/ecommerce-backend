import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    // .env se SECRET_KEY use karke verify karein
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // User find karein aur sensitive fields exclude karein
    const foundUser = await User.findById(decoded.id).select(
      "-password -otp -otpExpiry -token"
    );

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    req.id = foundUser._id;
    req.user = foundUser;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Access token has expired"
        : error.name === "JsonWebTokenError"
        ? "Access token is invalid"
        : error.message;

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin resources only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default isAuthenticated;