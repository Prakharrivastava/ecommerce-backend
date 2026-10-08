import express from "express";
import { createProduct, getProducts } from "../controller/productcontroller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Routes
router.post("/create", singleUpload, createProduct);
router.get("/get", getProducts);

export default router;