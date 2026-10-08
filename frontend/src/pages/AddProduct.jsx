import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    file: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      return toast.error("Please upload an image!");
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("file", formData.file);

      const res = await axios.post(
        "http://localhost:8000/api/v1/product/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product added successfully!");
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          file: null,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Product Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Price (₹)</label>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Product Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
        >
          {loading ? "Uploading..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product?.name || "Product"} added to cart!`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <img
        src={product?.image || "https://via.placeholder.com/150"}
        alt={product?.name || "Product"}
        className="h-40 w-full object-cover rounded-md mb-2"
      />
      <h3 className="font-bold text-lg">{product?.name}</h3>
      <p className="text-gray-600">₹{product?.price}</p>

      <button
        onClick={handleAddToCart}
        className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md font-medium transition cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddProduct;