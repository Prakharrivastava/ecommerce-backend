import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Loader2, 
  ArrowLeft, 
  Download, 
  Package, 
  Truck, 
  Home, 
  XCircle, 
  Clock 
} from "lucide-react";
import { toast } from "sonner";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Fetch Order Details
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/order/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Order fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  // Handle Cancel Order
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/order/cancel/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message || "Order cancelled successfully");
        setOrder((prev) => ({ ...prev, status: "Cancelled" }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  // PDF Invoice Generator
  const downloadInvoice = () => {
    if (!order) return;

    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(219, 39, 119); // Pink Theme Color
      doc.text("SHALINI ENTERPRISES", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("INVOICE / ORDER RECEIPT", 14, 26);

      // Order & Customer Details
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Order ID: #${order._id}`, 14, 36);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 42);
      doc.text(`Payment Method: ${order.paymentMethod || "COD"}`, 14, 48);

      // Shipping Address Info (Right Column)
      doc.setFont("helvetica", "bold");
      doc.text("Shipping Address:", 120, 36);
      doc.setFont("helvetica", "normal");
      doc.text(`${order.shippingAddress?.fullName || "N/A"}`, 120, 42);
      doc.text(`${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}`, 120, 48);
      doc.text(`Pincode: ${order.shippingAddress?.pinCode || order.shippingAddress?.pincode || "N/A"}`, 120, 54);
      doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 120, 60);

      // Items Table Setup
      const tableRows = order.orderItems.map((item) => [
        item.name || "Product Item",
        `Rs. ${item.price}`,
        item.quantity,
        `Rs. ${item.price * item.quantity}`,
      ]);

      autoTable(doc, {
        startY: 68,
        head: [["Item Description", "Price", "Qty", "Total"]],
        body: tableRows,
        headStyles: { fillColor: [219, 39, 119] },
        styles: { fontSize: 9 },
      });

      const finalY = (doc).lastAutoTable.finalY + 12;
      
      // Total Calculation Summary
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: Rs. ${order.totalPrice}`, 14, finalY);

      doc.save(`Invoice_${order._id}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF invoice");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-pink-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold text-lg">Order not found.</p>
        <Link to="/orders" className="text-pink-600 underline mt-2 inline-block">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const statuses = ["Placed", "Processing", "Shipped", "Delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link
          to="/orders"
          className="flex items-center text-gray-600 hover:text-pink-600 gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
        <div className="flex items-center gap-3">
          {order.status !== "Cancelled" && order.status !== "Delivered" && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm px-3.5 py-2 rounded-md transition-colors border border-red-200 cursor-pointer disabled:opacity-50"
            >
              <XCircle size={16} /> {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm"
          >
            <Download size={16} /> Download Invoice
          </button>
        </div>
      </div>

      {/* Status Tracking Timeline */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Order Status: <span className="text-pink-600">{order.status}</span>
          </h2>
          <span className="text-xs text-gray-500">
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        {order.status === "Cancelled" ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center font-medium border border-red-100 flex items-center justify-center gap-2">
            <XCircle size={18} /> This order has been cancelled.
          </div>
        ) : (
          <div className="flex justify-between items-center relative my-4">
            {statuses.map((st, idx) => {
              const isDone = idx <= currentStatusIndex;
              return (
                <div key={st} className="flex flex-col items-center z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all ${
                      isDone ? "bg-pink-600 ring-4 ring-pink-100" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {idx === 0 && <Package size={18} />}
                    {idx === 1 && <Clock size={18} />}
                    {idx === 2 && <Truck size={18} />}
                    {idx === 3 && <Home size={18} />}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isDone ? "text-pink-600 font-semibold" : "text-gray-400"
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Items List */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Order Items</h3>
          <div className="space-y-4">
            {order.orderItems?.map((item) => (
              <div key={item._id || item.product} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "https://via.placeholder.com/64"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-xs text-gray-500">Price: ₹{item.price}</p>
                  </div>
                </div>
                <p className="font-bold text-sm text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Shipping Address</h3>
            <p className="text-sm font-semibold text-gray-800">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-gray-600 mt-1">{order.shippingAddress?.street}</p>
            <p className="text-xs text-gray-600">
              {order.shippingAddress?.city} - {order.shippingAddress?.pinCode || order.shippingAddress?.pincode}
            </p>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Payment Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-800">{order.paymentMethod || "COD"}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t pt-3 mt-2 text-gray-900">
              <span>Total Amount:</span>
              <span className="text-pink-600 text-base">₹{order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;