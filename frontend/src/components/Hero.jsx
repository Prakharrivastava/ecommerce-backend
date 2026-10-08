import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-pink-50 via-white to-pink-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 font-semibold text-xs tracking-wider uppercase rounded-full">
            Welcome to Shalini Enterprises
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
           Step Into Quality & Style <br />
            <span className="text-pink-600">Products for You</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-xl">
            Premium Leather Shoes, Sports Footwear & Complete Shoe Care.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <Link 
              to="/products" 
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-md"
            >
              Shop Now
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Highlights Badge */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-lg font-bold text-gray-900">100%</p>
              <p className="text-xs text-gray-500">Genuine Products</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Fast</p>
              <p className="text-xs text-gray-500">Home Delivery</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">24/7</p>
              <p className="text-xs text-gray-500">Customer Support</p>
            </div>
          </div>
        </div>

        {/* Right Banner Image */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <img 
              src="https://vaquerosswing.co.uk/uploads/2025/02/best-leather-shoe-brands-for-quality-and-style.webp" 
              alt="Shopping Banner" 
              className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero