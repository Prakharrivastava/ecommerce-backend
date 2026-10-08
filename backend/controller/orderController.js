import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

// 1. Place New Order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;
    
    // Auth Middleware support check
    const userId = req.id || req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided" });
    }

    // Process orderItems to prevent missing product ObjectId
    const formattedItems = orderItems.map((item) => ({
      name: item.name || item.title,
      quantity: Number(item.quantity || item.qty || 1),
      image: item.image,
      price: Number(item.price || 0),
      product: item.product || item._id, // Ensure Mongo ObjectId exists
    }));

    // Process shippingAddress to match schema casing
    const formattedAddress = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone || shippingAddress.phoneNo,
      street: shippingAddress.street || shippingAddress.address,
      city: shippingAddress.city,
      pinCode: shippingAddress.pinCode || shippingAddress.pincode || shippingAddress.zipCode,
    };

    const order = await Order.create({
      user: userId,
      orderItems: formattedItems,
      shippingAddress: formattedAddress,
      totalPrice,
      paymentMethod: paymentMethod || "COD",
    });

    // User details fetch karke email send karein
    try {
      const userInfo = req.user?.email ? req.user : await User.findById(userId);

      if (userInfo && userInfo.email) {
        const itemsList = formattedItems
          .map(
            (item) =>
              `<li><b>${item.name}</b> - Qty: ${item.quantity} × ₹${item.price} = ₹${
                item.quantity * item.price
              }</li>`
          )
          .join("");

        const emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #db2777;">Thank you for your order!</h2>
            <p>Hi <b>${formattedAddress.fullName}</b>,</p>
            <p>Your order has been placed successfully and is being processed.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
            
            <p><b>Order ID:</b> ${order._id}</p>
            <p><b>Payment Method:</b> ${order.paymentMethod}</p>
            
            <h3>Order Details:</h3>
            <ul>${itemsList}</ul>
            
            <p style="font-size: 16px;"><b>Total Price:</b> ₹${totalPrice}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
            
            <p style="font-size: 12px; color: #777;">If you have any questions, reply to this email or contact support.</p>
          </div>
        `;

        // Async email sending execution
        sendEmail({
          email: userInfo.email,
          subject: `Order Confirmation - #${order._id}`,
          html: emailMessage,
        }).catch((err) => console.error("Email send warning:", err.message));
      }
    } catch (emailErr) {
      console.error("Failed to process email notification:", emailErr.message);
    }

    return res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order Creation Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Logged-in User Orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.id || req.user?._id || req.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Order Detail
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled once it is ${order.status}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true, runValidators: false }
    );

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Admin: Get All Orders
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// 6. Admin: Update Order Status
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};