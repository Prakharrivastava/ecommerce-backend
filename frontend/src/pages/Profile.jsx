import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Mail, LogOut, ShoppingBag, MapPin, Camera, Edit2, Check, X, Phone, Home } from 'lucide-react'
import { logoutUser, setUser } from '../redux/userSlice'
import { clearCart } from '../redux/cartSlice' // <-- clearCart import kiya gaya hai
import { toast } from 'sonner'
import axios from 'axios'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const { userInfo, isAuthenticated } = useSelector((state) => state.user)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  // Sync state with Redux store
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || ''
      })
    }
  }, [userInfo])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogout = () => {
    // 1. Redux user state aur cart state clear karein
    dispatch(logoutUser())
    dispatch(clearCart()) // <-- Logout hone par cart items empty ho jayenge
    
    // 2. Tokens aur user data remove karein
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cartItems')
    
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      dispatch(setUser({
        ...userInfo,
        profilePic: imageUrl
      }))
      toast.success('Profile picture updated!')
    }
  }

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Email cannot be empty')
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken')

      dispatch(setUser({
        ...userInfo,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }))

      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  if (!isAuthenticated || !userInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">You are not logged in</h2>
        <p className="text-gray-500 mb-6">Please log in to view your profile details.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-32 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md relative group">
              {userInfo?.profilePic ? (
                <img 
                  src={userInfo.profilePic} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl font-bold uppercase">
                  {userInfo?.name ? userInfo.name.charAt(0) : 'U'}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-pink-600 hover:bg-pink-700 text-white p-1.5 rounded-full shadow-md transition-colors cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-14 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {userInfo?.name || 'User Name'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Valued Customer</p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shadow-sm ${
                  isEditing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Conditional Form / Details View */}
          {isEditing ? (
            <div className="bg-pink-50/40 border border-pink-200 rounded-xl p-6 mb-8 space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Edit Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium bg-pink-600 text-white rounded-lg hover:bg-pink-700 cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-pink-50/50 border border-pink-100">
                <Mail className="w-5 h-5 text-pink-600 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{userInfo?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl bg-pink-50/50 border border-pink-100">
                <Phone className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-800">{userInfo?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl bg-pink-50/50 border border-pink-100 md:col-span-2">
                <Home className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Primary Address</p>
                  <p className="text-sm font-semibold text-gray-800">{userInfo?.address || 'No address added yet'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Account Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => navigate('/orders')}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-pink-300 hover:bg-pink-50/20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-medium text-gray-800">My Orders</span>
                </div>
                <span className="text-xs text-gray-400">→</span>
              </button>

              <button 
                type="button"
                onClick={() => navigate('/address')}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-pink-300 hover:bg-pink-50/20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-medium text-gray-800">Saved Addresses</span>
                </div>
                <span className="text-xs text-gray-400">→</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile