import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8000/api/v1/order/my-orders", {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          withCredentials: true,
        });

        if (res.data.success) {
          setOrders(res.data.orders || res.data.order || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium">
          ← Back to Profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-md transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = order.orderItems || order.items || order.products || [];
            const totalPrice = order.totalPrice || order.totalAmount || 0;

            return (
              <div key={order._id} className="bg-white rounded-xl border p-6 shadow-sm">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">ORDER ID</p>
                    <p className="font-bold text-gray-800">{order._id}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {order.status || "Placed"}
                    </span>
                    <p className="font-bold text-pink-600 text-lg">₹{totalPrice}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {items.map((item, idx) => {
                    const itemName = item.name || item.product?.name || "Product";
                    const itemImg = item.image || item.product?.image || item.product?.images?.[0];
                    const itemQty = item.quantity || item.qty || 1;
                    const itemPrice = item.price || item.product?.price || 0;

                    return (
                      <div key={item._id || idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          {itemImg && (
                            <img
                              src={itemImg}
                              alt={itemName}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{itemName}</p>
                            <p className="text-xs text-gray-500">Qty: {itemQty}</p>
                          </div>
                        </div>
                        <p className="font-bold">₹{itemPrice * itemQty}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Track Order Action Button */}
                <div className="border-t pt-4 flex justify-end">
                  <Link
                    to={`/orders/${order._id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;