'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaGift, FaMoneyBillAlt, FaCreditCard } from 'react-icons/fa'
import TruckButton from '../components/TruckButton' // adjust the path as needed

export default function CheckoutPage() {
  // Form state
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
  const [errors, setErrors] = useState({})

  // Sample order data
  const items = [
    { id: 1, name: '2 Tikkas Tandoori', price: 950 },
    { id: 2, name: 'Select Your Veggies', price: 150 },
  ]

  // Pricing calculations
  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const deliveryFee = 50
  const tax = Math.round(subtotal * 0.05)
  const discount = Math.round(subtotal * 0.1)
  const total = subtotal + deliveryFee + tax - discount

  // Validation for TruckButton animation
  const validateBeforeAnimation = () => {
    const newErrors = {}
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!mobileNumber.trim())
      newErrors.mobileNumber = 'Mobile Number is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }
    setErrors({})
    return true
  }

  // Order submission (called after truck animation completes)
  const submitOrder = async () => {
    const orderData = {
      title,
      fullName,
      mobileNumber,
      alternateMobile,
      deliveryAddress,
      nearestLandmark,
      email,
      paymentInstructions,
      paymentMethod,
      changeRequest,
      promoCode,
      items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      const result = await response.json()

      if (result.success) {
        alert('Order placed successfully! Order ID: ' + result.orderId)
        // Optionally reset form or navigate to a success page
      } else {
        alert('Error: ' + result.error)
      }
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Something went wrong placing the order.')
    }
  }

  // Promo code handler
  const handleApplyPromo = () => {
    alert(`Promo code applied: ${promoCode}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-600">Checkout</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              This is a Delivery Order • Just one last step: please enter your details.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2 rounded-md text-sm font-medium"
          >
            <FaGift className="mr-2" />
            Send as a Gift
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-2 bg-white rounded-md shadow-md p-6">
            <form noValidate>
              {/* Title & Full Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Miss</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                  )}
                </div>
              </div>

              {/* Mobile Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  placeholder="03xx-xxxxxxx"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Alternate Mobile */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Mobile Number
                </label>
                <input
                  type="tel"
                  value={alternateMobile}
                  onChange={(e) => setAlternateMobile(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  placeholder="Optional"
                />
              </div>

              {/* Delivery Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  placeholder="Street, House #, etc."
                />
              </div>

              {/* Nearest Landmark */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nearest Landmark
                </label>
                <input
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  placeholder="Any famous place nearby"
                />
              </div>

              {/* Email Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>

              {/* Payment Instructions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Instructions
                </label>
                <textarea
                  rows={3}
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                  placeholder="Any special instructions regarding payment?"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700">
                  Payment Information
                </span>
                <div className="mt-2 flex items-center space-x-6">
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <FaMoneyBillAlt className="ml-2 text-red-600" />
                    <span className="ml-1">Cash on Delivery</span>
                  </label>
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <FaCreditCard className="ml-2 text-red-600" />
                    <span className="ml-1">Online Payment</span>
                  </label>
                </div>
              </div>

              {/* Change Request (for COD only) */}
              {paymentMethod === 'cod' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Change Request
                  </label>
                  <input
                    type="text"
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    placeholder="e.g., Need change for 2000"
                  />
                </div>
              )}

              {/* Use TruckButton as the Place Order button */}
              <div className="mt-6 flex justify-center">
  <TruckButton
    beforeAnimation={validateBeforeAnimation}
    onComplete={submitOrder}
  />
</div>

            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="bg-white rounded-md shadow-md p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Order
            </h3>
            <div className="space-y-3 border-b pb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-700 text-sm">{item.name}</span>
                  <span className="font-semibold text-sm">Rs. {item.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>Rs. {tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (10%)</span>
                <span>-Rs. {discount}</span>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 flex justify-between text-base font-bold text-gray-900">
              <span>Grand Total</span>
              <span>Rs. {total}</span>
            </div>

            {/* Promo Code */}
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter Voucher / Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href="#" className="text-red-600 text-sm hover:underline">
                &larr; continue to add more items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
