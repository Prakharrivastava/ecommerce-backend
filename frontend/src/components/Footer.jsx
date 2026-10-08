import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wider uppercase">
            Shalini Enterprises
          </h2>
          <p className="text-sm text-gray-400">
            Your one-stop destination for high-quality products at unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-pink-500 transition-colors">Products</Link></li>
            <li><Link to="/about" className="hover:text-pink-500 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-pink-500 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-pink-500 transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-pink-500 transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-pink-500 transition-colors">Return & Refund</a></li>
            <li><a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <h3 className="text-white font-semibold mb-4">Get In Touch</h3>
          <p className="text-gray-400">📍 Kanpur, Uttar Pradesh, India</p>
          <p className="text-gray-400">✉️ shalinienterprises38@gmail.com</p>
          <p className="text-gray-400">📞 +91 8318193980</p>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Shalini Enterprises. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer