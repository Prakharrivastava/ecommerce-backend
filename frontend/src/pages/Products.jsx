import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // Redux path verify karein
import { toast } from "sonner"; // Toast notification feedback ke liye

// Static sample data
const dummyProducts = [
  {
    _id: "1",
    name: "Sfarek Juliet 4 Women Slip-On",
    price: 600,
    category: "Casual Footwear",
    description: "Comfortable knitted slip-on casual shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    _id: "2",
    name: "HRX Premium Sports Sneakers",
    price: 560,
    category: "Sports",
    description: "Multi-color durable outdoor sneakers",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
  },
  {
    _id: "3",
    name: "Red Chief Sports DynaCush",
    price: 3645,
    category: "Sports",
    description: "High-cushion lightweight black running shoes",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
  },
  {
    _id: "4",
    name: "Casual White & Brown Chunky Sneakers",
    price: 2845,
    category: "Casual",
    description: "Trendy multi-texture daily wear sneakers",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
  },
  {
    _id: "5",
    name: "Zoom Classic Tan Leather Formal Shoes",
    price: 1999,
    category: "Formal",
    description: "Textured designer tan oxford shoes",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500",
  },
  {
    _id: "6",
    name: "Textured Brown Leather Loafers",
    price: 1499,
    category: "Loafers",
    description: "Soft stitched casual driving loafers",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500",
  },
  {
    _id: "7",
    name: "Zoom Black High-Top Boots",
    price: 2499,
    category: "Boots",
    description: "Durable leather lace-up ankle boots",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500",
  },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/product/get");
        if (res.data.success && res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else {
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error("API error, using fallback data:", error);
        setProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Ensure product always has a valid _id for Redux matching
    const itemToCart = {
      ...product,
      _id: product._id || product.id || String(Date.now()),
    };

    dispatch(addToCart(itemToCart));
    toast.success(`${product.name || "Item"} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Our Footwear Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={product._id || product.id || index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col justify-between"
          >
            <div className="relative h-56 w-full bg-gray-100">
              <img
                src={product.image || product.productImage || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                {product.category || "Footwear"}
              </span>
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-transform cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;