'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

function BannerSwiper() {
  const banners = [
    'Welcome Tipu Burger & Broast',
    'Flat 10% Off on all Items',
    'Discover Our Special Dishes',
  ]
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="bg-white py-1 flex justify-center items-center w-full">
      <h2 className="text-red-600 text-sm md:text-xl font-semibold px-4 mx-auto max-w-full text-center">
        {banners[currentBanner]}
      </h2>
    </div>
  )
}

export default function Hero() {
  const images = ['/hero.jpg', '/hero-2.jpg', '/hero-3.jpg']
  const [current, setCurrent] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextImage() : prevImage()
      }
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  return (
    <section className="relative">
      <BannerSwiper />

      <div
        className="relative w-full aspect-[750/250] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image src={images[current]} alt="Hero" fill priority />

        {/* Dot navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full focus:outline-none ${
                idx === current ? 'bg-red-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
