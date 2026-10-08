import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Trash2, Edit2, ArrowLeft, Building, Home, Phone } from 'lucide-react'
import { toast } from 'sonner'

const Address = () => {
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: 'Shalini Sharma',
      phone: '9876543210',
      street: '123, Civil Lines, Near Green Park',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      pincode: '208001',
      type: 'Home',
      isDefault: true,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home',
  })

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Open Form for Adding New Address
  const handleOpenAddForm = () => {
    setEditingId(null)
    setFormData({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'Home' })
    setShowForm(true)
  }

  // Open Form for Editing Existing Address
  const handleEditClick = (addr) => {
    setEditingId(addr.id)
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type,
    })
    setShowForm(true)
  }

  // Save (Add / Update) Address
  const handleSaveAddress = (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields')
      return
    }

    if (editingId) {
      // Update Existing Address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId ? { ...addr, ...formData } : addr
        )
      )
      toast.success('Address updated successfully!')
    } else {
      // Add New Address
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, newAddress])
      toast.success('Address added successfully!')
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'Home' })
  }

  // Delete Address
  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
    toast.success('Address deleted')
  }

  // Set Default Address
  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
    toast.success('Default address updated')
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Profile
        </button>

        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {/* Add / Edit Form Modal/Section */}
      {showForm && (
        <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm mb-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
            {editingId ? 'Edit Delivery Address' : 'Add Delivery Address'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600">Flat, House no., Building, Street *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Address details"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">City / Town *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">PIN Code *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Address Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-pink-500 bg-white"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 cursor-pointer"
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
            <MapPin className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No saved addresses found</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white p-5 rounded-2xl border transition-all ${
                addr.isDefault ? 'border-pink-500 bg-pink-50/20 shadow-sm' : 'border-gray-200 hover:border-pink-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{addr.fullName}</span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      {addr.type === 'Home' ? <Home className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 pt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {addr.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                  {/* Edit Icon Button */}
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* Delete Icon Button */}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Address