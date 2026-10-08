import { Product } from "../models/productmodel.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Product image is required",
        success: false,
      });
    }

    // File ko Data URI me convert karke Cloudinary par upload karein
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      folder: "products",
    });

    // MongoDB me record create karein
    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: cloudResponse.secure_url,
    });

    return res.status(201).json({
      message: "Product created successfully!",
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};