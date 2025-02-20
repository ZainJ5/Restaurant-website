'use client'
import { useState } from 'react'
import { FaCreditCard, FaMoneyBill, FaGift } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { useCartStore } from '../../store/cart'

export default function CheckoutPage() {
  const [title, setTitle] = useState('Mr.')
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [alternateMobile, setAlternateMobile] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [nearestLandmark, setNearestLandmark] = useState('')
  const [email, setEmail] = useState('')
  const [paymentInstructions, setPaymentInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [changeRequest, setChangeRequest] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')

  const { items, total, clearCart } = useCartStore()
  const subtotal = total
  const tax = Math.round(subtotal * 0.18)
  const deliveryFee = 100
  const discount = 112
  const grandTotal = subtotal + tax + deliveryFee - discount

  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.title, 
        price: item.price,
        quantity: item.quantity,
      }))

      const orderData = {
        fullName,
        mobileNumber,
        alternateMobile,
        deliveryAddress,
        nearestLandmark,
        email,
        paymentInstructions,
        paymentMethod,
        changeRequest,
        items: orderItems,
        subtotal,
        tax,
        discount,
        total: grandTotal,
        promoCode,
        isGift,
        giftMessage,
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const data = await response.json()
      console.log('Order placed successfully:', data)

      clearCart()
      resetFormFields()

      toast.success('Order placed successfully!', {
        style: { background: '#16a34a', color: '#ffffff' },
      })
    } catch (error) {
      console.error(error)
      toast.error('Error placing order', {
        style: { background: '#dc2626', color: '#ffffff' },
      })
    }
  }

  const resetFormFields = () => {
    setTitle('Mr.')
    setFullName('')
    setMobileNumber('')
    setAlternateMobile('')
    setDeliveryAddress('')
    setNearestLandmark('')
    setEmail('')
    setPaymentInstructions('')
    setPaymentMethod('cod')
    setChangeRequest('')
    setPromoCode('')
    setIsGift(false)
    setGiftMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <img src="/Logo.jpeg" alt="Logo" className="h-24 sm:h-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Checkout</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  This is a Delivery Order <span className="text-red-600">🚚</span>
                  <br />
                  Just a last step, please enter your details:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGift(!isGift)}
                className="inline-flex items-center justify-center px-4 py-2 border-2 border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                <FaGift className="mr-2" />
                <span>{isGift ? 'Remove Gift Option' : 'Send as a Gift'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-sm text-gray-700 mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*Required</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*Required</span>
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="03xx-xxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Alternate Mobile Number</label>
                  <input
                    type="tel"
                    value={alternateMobile}
                    onChange={(e) => setAlternateMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="03xx-xxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*Required</span>
                </label>
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md sm:rounded-r-none mb-2 sm:mb-0"
                    placeholder="Enter your complete address"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md sm:rounded-l-none sm:border-l-0 text-gray-600"
                  >
                    Bahria ...
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nearest Landmark</label>
                  <input
                    type="text"
                    value={nearestLandmark}
                    onChange={(e) => setNearestLandmark(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="any famous place nearby"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Payment Instructions</label>
                <textarea
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                  placeholder="Any notes or instructions about payment?"
                  rows={3}
                />
              </div>

              {isGift && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Gift Message</label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="Enter a gift message"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-2">Payment Information</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border rounded-md flex items-center justify-center space-x-2 ${
                      paymentMethod === 'cod'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <FaMoneyBill className="text-green-500" />
                    <span>Cash on Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 border rounded-md flex items-center justify-center space-x-2 ${
                      paymentMethod === 'online'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <FaCreditCard className="text-blue-500" />
                    <span>Online Payment</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'cod' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Change Request</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200 rounded-l-md bg-gray-50">
                      Rs.
                    </span>
                    <input
                      type="text"
                      value={changeRequest}
                      onChange={(e) => setChangeRequest(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-r-md"
                      placeholder="500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sticky top-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg sm:text-xl font-semibold">Your Order</h2>
              </div>
              <span className="text-lg sm:text-xl font-semibold">Rs. {subtotal}</span>
            </div>

            {items.length > 0 && (
              <div className="mb-4 space-y-2">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4 text-sm sm:text-base text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax 18%</span>
                <span>Rs. {tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-yellow-500">
                <span>Discount</span>
                <span>Rs. {discount}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span>Grand Total</span>
                <span>Rs. {grandTotal}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-l-md"
                  placeholder="Enter Voucher / Promo code"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
                >
                  Apply
                </button>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Place Order
              </button>

              <a
                href="/"
                className="block mt-4 text-center text-blue-500 hover:underline text-sm sm:text-base"
              >
                ← continue to add more items
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
