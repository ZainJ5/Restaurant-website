'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import whatsapp from '../../../public/whatsapp-logo.png'

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [branch, setBranch] = useState(null)

  const handleLocationChange = (newBranch) => {
    setBranch(newBranch)
    setIsModalOpen(false)
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full border-[3px] sm:border-4 border-yellow-400 overflow-hidden ml-4 sm:ml-8 md:ml-12 -mt-8 sm:-mt-10 md:-mt-14">
        <Image src="/Logo.jpeg" alt="Logo" fill className="object-cover" />
      </div>

      <div className="pt-10 sm:pt-20 md:pt-24 lg:pt-24 pb-2 md:pb-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6">
            
            <div className="flex flex-col text-center sm:text-left mt-2 sm:mt-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                Restaurant Name
              </h1>
              <div className="flex flex-col gap-1 sm:gap-2">
                <div className="text-red-600 text-xs sm:text-sm md:text-base">
                  <span>Open: </span>
                  <span className="font-normal text-black">11:30 am to 3:30 am</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-red-600 text-xs sm:text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <span>Branch:</span>
                    <span className="font-normal text-black">{branch || "Select Location"}</span>
                  </div>
                  <span
                    onClick={() => setIsModalOpen(true)}
                    className="underline hover:text-red-700 text-[11px] sm:text-xs cursor-pointer"
                  >
                    {branch ? "Change Location" : "Choose Location"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 shadow-[0_0_8px_rgba(0,0,0,0.1)] sm:shadow-[0_0_10px_rgba(0,0,0,0.2)] w-full max-w-xs sm:max-w-none sm:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-black font-semibold text-sm sm:text-base">30-45 mins</span>
                  <span className="text-gray-600 text-[11px] sm:text-xs">Delivery Time</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
                <div className="flex flex-col items-center">
                  <span className="text-black font-semibold text-sm sm:text-base">Rs. 500 Only</span>
                  <span className="text-gray-600 text-[11px] sm:text-xs">Minimum Order</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {[
                { src: '/download.png', bg: 'bg-red-700' },
                { src: whatsapp.src, bg: 'bg-[rgb(42,168,26)]' },
                { src: '/phone.png', bg: 'bg-blue-500' },
                { src: '/facebook.png', bg: 'bg-[rgb(12,144,242)]' },
                { src: '/instagram.png', bg: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' }
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`${item.bg} rounded relative hover:opacity-90 transition-opacity w-8 h-8 sm:w-10 sm:h-10`}
                >
                  <Image 
                    src={item.src} 
                    alt="Social" 
                    fill
                    className="object-contain scale-90 p-[2px]"
                    sizes="(max-width: 640px) 32px, 40px"
                  />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 w-72 transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-semibold mb-4">Select Your Location</h2>
            <p className="text-gray-600 mb-6">Please choose your preferred branch:</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleLocationChange("DHA")}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                DHA
              </button>
              <button
                onClick={() => handleLocationChange("Gulberg")}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Gulberg
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
