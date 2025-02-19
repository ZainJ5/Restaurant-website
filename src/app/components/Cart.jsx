'use client'
import { useEffect, useState } from 'react'
import { X, Plus, Minus, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const frequentlyBoughtItems = [
  { id: 1, name: "Bun Kabab", price: 567, image: "/api/placeholder/120/90", category: "Main Course", rating: 4.7, orderCount: 1240 },
  { id: 2, name: "Bun Kabab Frozen", price: 117, image: "/api/placeholder/120/90", category: "Frozen Food", rating: 4.5, orderCount: 856 },
  { id: 3, name: "Riwayati Kulfi", price: 349, image: "/api/placeholder/120/90", category: "Desserts", rating: 4.8, orderCount: 972 },
  { id: 4, name: "Chicken Biryani", price: 450, image: "/api/placeholder/120/90", category: "Main Course", rating: 4.9, orderCount: 1850 },
  { id: 5, name: "Samosa Platter", price: 280, image: "/api/placeholder/120/90", category: "Appetizers", rating: 4.6, orderCount: 1120 }
];

export default function CartDrawer({ isOpen, onClose }) {
  const router = useRouter()
  const { cart, removeFromCart, clearCart, updateItemQuantity } = useCart()
  const [visibleRecommendations, setVisibleRecommendations] = useState(frequentlyBoughtItems.slice(0, 3))
  const [currentPage, setCurrentPage] = useState(0)

  const handleCheckout = () => {
    router.push('/checkout')
    onClose()
    clearCart()
    toast.success('Redirecting to checkout...')
  }

  const handleAddMoreItems = () => {
    onClose()
    toast.info('Continue shopping!', { icon: '🛒', style: { background: '#dc2626', color: '#ffffff' } })
  }

  const nextPage = () => {
    const nextIndex = (currentPage + 1) % Math.ceil(frequentlyBoughtItems.length / 3)
    setCurrentPage(nextIndex)
    setVisibleRecommendations(frequentlyBoughtItems.slice(nextIndex * 3, nextIndex * 3 + 3))
  }

  const prevPage = () => {
    const nextIndex = currentPage === 0 ? Math.ceil(frequentlyBoughtItems.length / 3) - 1 : currentPage - 1
    setCurrentPage(nextIndex)
    setVisibleRecommendations(frequentlyBoughtItems.slice(nextIndex * 3, nextIndex * 3 + 3))
  }

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && isOpen && onClose()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <div className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 transform 
      ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-out 
      shadow-2xl border-l-4 border-red-600 rounded-l-3xl overflow-hidden`}>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fee2e2; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b91c1c; }
      `}</style>

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-red-100 bg-red-600">
          <h2 className="text-xl font-bold text-white">Your Cart ({cart.itemCount})</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-red-700 hover:bg-red-800 transition-colors" aria-label="Close cart">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {cart.items.length === 0 ? (
            <div className="p-6 text-center flex flex-col items-center justify-center h-full">
              <div className="w-32 h-32 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">Your cart feels lonely!</p>
              <p className="text-gray-400 mt-2">Add delicious items to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cart.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="p-4 group hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-red-100 flex-shrink-0 relative shadow-sm">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" loading="lazy" placeholder="blur" blurDataURL="/placeholder.svg" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-red-700 font-medium mt-1">Rs. {(item.price * (item.quantity || 1)).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-full shadow-sm bg-white">
                          <button className="w-8 h-8 flex items-center justify-center text-red-600 rounded-l-full hover:bg-red-50 transition-colors" onClick={() => updateItemQuantity(index, (item.quantity || 1) - 1)}>
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-700">{item.quantity || 1}</span>
                          <button className="w-8 h-8 flex items-center justify-center text-red-600 rounded-r-full hover:bg-red-50 transition-colors" onClick={() => updateItemQuantity(index, (item.quantity || 1) + 1)}>
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {item.addons?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.addons.map((addon, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-500">+ {addon.name}</span>
                              <span className="text-gray-600">Rs. {addon.price?.toLocaleString() || 0}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-y border-gray-100 bg-gray-50">
            <button className="flex items-center text-red-700 font-semibold hover:text-red-800 transition-colors w-full justify-center" onClick={handleAddMoreItems}>
              <Plus className="w-5 h-5 mr-2 text-red-600" />
              Add more items
            </button>
          </div>

          {cart.items.length > 0 && (
            <div className="p-4 bg-gradient-to-b from-red-50 to-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">Frequently Bought Together</h3>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors" onClick={prevPage}>
                    <ChevronRight className="w-5 h-5 transform rotate-180" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors" onClick={nextPage}>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {visibleRecommendations.map(product => (
                  <div key={product.id} className="border-2 border-transparent rounded-xl overflow-hidden hover:border-red-200 bg-white hover:shadow-md transition-all duration-300 group relative">
                    <div className="h-24 bg-gray-100 relative">
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      <button className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg text-red-600 hover:bg-red-50 transition-colors" onClick={() => toast.success(`${product.name} added to cart!`)}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold truncate">{product.name}</p>
                      <p className="text-xs text-red-700 mt-1">Rs. {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Subtotal</span>
                <span className="font-bold text-red-800">Rs. {cart.total.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] transform active:scale-95">
                <span>Secure Checkout</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="text-center text-sm text-gray-400 mt-2 space-y-1">
                <p>Free delivery for orders over Rs. 2000</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>100% Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}