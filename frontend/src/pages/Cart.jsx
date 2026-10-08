import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Your Cart is Empty</h2>
        <Link to="/products" className="text-pink-600 underline font-medium hover:text-pink-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h2>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image || item.productImage || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 font-medium">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDecrement(item)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold cursor-pointer"
              >
                -
              </button>
              <span className="font-semibold px-2">{item.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    updateQuantity({ id: item._id, quantity: item.quantity + 1 })
                  )
                }
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold cursor-pointer"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => dispatch(removeFromCart(item._id))}
                className="text-red-500 hover:text-red-700 font-medium ml-4 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-4">
        <div>
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="text-sm text-red-600 hover:text-red-800 underline font-medium cursor-pointer"
          >
            Clear Cart
          </button>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-bold text-gray-900">Total: ₹{totalPrice}</h3>
          
          <Link
            to="/checkout"
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-md transition-colors inline-block shadow-sm"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;