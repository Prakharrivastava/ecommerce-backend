import React from 'react'

const Features = () => {
  const featuresList = [
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On all orders over ₹999"
    },
    {
      icon: "🛡️",
      title: "Secure Payment",
      description: "100% secure payment gateways"
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      description: "7 days hassle-free return policy"
    },
    {
      icon: "🎧",
      title: "24/7 Support",
      description: "Dedicated support anytime"
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresList.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-4 p-4 rounded-xl border border-pink-100 bg-pink-50/30 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl p-3 bg-white rounded-lg shadow-sm">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features