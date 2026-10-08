import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controller/orderController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

// User Routes
router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/detail/:id", isAuthenticated, getOrderDetail);
router.put("/cancel/:id", isAuthenticated, cancelOrder);

// Admin Routes (Protected with isAdmin)
router.get("/admin/all", isAuthenticated, isAdmin, getAllOrdersAdmin);
router.put("/admin/status/:id", isAuthenticated, isAdmin, updateOrderStatusAdmin);

export default router;