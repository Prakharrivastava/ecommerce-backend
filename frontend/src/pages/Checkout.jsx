import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice"; // Fixed case-sensitivity
import { toast } from "sonner";
import axios from "axios";

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pinCode: "",
  });

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async (e) => {
  e.preventDefault();

  if (cartItems.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  setLoading(true);

  try {
    const storedToken = localStorage.getItem("token") || token;

    if (!storedToken) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    // Safely map order items to handle all id variations
    const formattedOrderItems = cartItems.map((item) => {
      const productId = item._id || item.product || item.id;
      if (!productId) {
        console.error("Missing Product ID for item:", item);
      }

      return {
        product: productId,
        name: item.name || item.title || "Product Item",
        quantity: Number(item.quantity || item.qty || 1),
        price: Number(item.price || 0),
        image: item.image || item.images?.[0] || "",
      };
    });

    // Address payload supporting both casing variations
    const formattedAddress = {
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      pinCode: address.pinCode,
      pincode: address.pinCode, // Fallback for backend schema
    };

    const orderData = {
      orderItems: formattedOrderItems,
      shippingAddress: formattedAddress,
      totalPrice: Number(totalAmount),
      paymentMethod: "COD",
    };

    const res = await axios.post(
      "http://localhost:8000/api/v1/order/create",
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      dispatch(clearCart());
      toast.success(res.data.message || "Order Placed Successfully!");
      navigate("/orders");
    }
  } catch (error) {
    console.error("Checkout Error Details:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Order creation failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Address Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Shipping Address
        </h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={address.fullName}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none"
              placeholder="Shalini Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={address.phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street / Area
            </label>
            <input
              type="text"
              name="street"
              required
              value={address.street}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none"
              placeholder="House No, Landmark, Colony"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                name="pinCode"
                required
                value={address.pinCode}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-bold py-2.5 rounded-md transition-colors cursor-pointer mt-4"
          >
            {loading ? "Processing..." : "Place Order (Cash on Delivery)"}
          </button>
        </form>
      </div>

      {/* Order Summary Side panel */}
      <div className="bg-gray-50 p-6 rounded-lg border h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center text-sm border-b pb-2"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-gray-500">Qty: {item.quantity || 1}</p>
              </div>
              <p className="font-bold text-gray-700">
                ₹{item.price * (item.quantity || 1)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;