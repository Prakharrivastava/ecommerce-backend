import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { logoutUser } from '../../redux/userSlice'
import { clearCart } from '../../redux/cartSlice' // <-- clearCart import kiya gaya hai

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userInfo, isAuthenticated } = useSelector((state) => state.user)
  // Cart state connect ki gayi hai
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] })

  // Total items calculate karne ke liye
  const totalCartCount = cartItems
    ? cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0

  const handleLogout = () => {
    // 1. User aur Cart state clear karein
    dispatch(logoutUser())
    dispatch(clearCart()) // <-- Logout hone par cart items empty ho jayenge

    // 2. LocalStorage items remove karein
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cartItems') // <-- Cart items localStorage se bhi delete honge

    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-pink-50/80 border-b border-pink-100 text-gray-800 shadow-sm">
      {/* Brand Name */}
      <Link to="/" className="flex items-center space-x-2 text-pink-600 hover:opacity-90">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-7" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <span className="text-xl font-extrabold tracking-wider uppercase">
          Shalini Enterprises
        </span>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center space-x-6 text-sm font-semibold text-gray-700">
        <Link to="/" className="hover:text-pink-600 transition-colors">
          Home
        </Link>
        <Link to="/products" className="hover:text-pink-600 transition-colors">
          Products
        </Link>
        
        {/* Clickable Profile Link / Greeting */}
        {isAuthenticated ? (
          <Link 
            to="/profile" 
            className="text-gray-800 font-medium capitalize hover:text-pink-600 transition-colors underline decoration-pink-300 underline-offset-4"
          >
            Hello, {userInfo?.name?.split(' ')[0] || 'Profile'}
          </Link>
        ) : (
          <span className="text-gray-500 font-medium capitalize">
            Hello Guest
          </span>
        )}

        {/* Dynamic Cart Icon Badge */}
        <Link to="/cart" className="relative p-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-700 hover:text-pink-600 transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          
          <span className="absolute -top-1 -right-2 bg-pink-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {totalCartCount}
          </span>
        </Link>

        {/* Conditional Profile Avatar & Logout / Login Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Profile Avatar Link */}
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {userInfo?.profilePic ? (
                <img
                  src={userInfo.profilePic}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-pink-300"
                />
              ) : (
                <div className="w-9 h-9 bg-pink-200 text-pink-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-pink-300">
                  {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </Link>

            {/* Logout Button */}
            <button 
              type="button" 
              onClick={handleLogout}
              className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors shadow-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar