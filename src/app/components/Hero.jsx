'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa'
import { useCartStore } from '../../store/cart' 
import CartDrawer from './Cart'

function FadeImage({ src, alt, animateIn, animateOut, onAnimationEnd }) {
  const [styles, setStyles] = useState({
    opacity: animateIn ? 0 : 1,
    transform: animateIn ? 'scale(0.95)' : 'scale(1)',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animateIn) {
        setStyles({ opacity: 1, transform: 'scale(1)' })
      }
      if (animateOut) {
        setStyles({ opacity: 0, transform: 'scale(1.05)' })
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [animateIn, animateOut])

  return (
    <div
      style={{
        ...styles,
        transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
      }}
      onTransitionEnd={onAnimationEnd}
      className="w-full h-full"
    >
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} priority />
    </div>
  )
}

function BannerSwiper() {
  const banners = [
    'Welcome Restaurant Name',
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
    <div className="bg-white text-center py-1">
      <h2 className="text-red-600 text-sm md:text-xl font-semibold">
        {banners[currentBanner]}
      </h2>
    </div>
  )
}

export default function Hero() {
  const images = ['/hero.jpg', '/hero-2.jpg', '/hero-3.jpg']
  const { items, total } = useCartStore()

  const [sliderState, setSliderState] = useState({
    current: 0,
    previous: null,
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  const updateImage = (newIndex) => {
    if (newIndex === sliderState.current) return
    setSliderState((prev) => ({
      previous: prev.current,
      current: newIndex,
    }))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderState((prev) => ({
        previous: prev.current,
        current: (prev.current + 1) % images.length,
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative">
      <BannerSwiper />

      {/* Updated the aspect ratio here to reduce the banner height */}
      <div className="relative w-full aspect-[750/250] overflow-hidden">
        {sliderState.previous !== null && (
          <div className="absolute inset-0">
            <FadeImage
              src={images[sliderState.previous]}
              alt="Hero"
              animateOut={true}
              onAnimationEnd={() =>
                setSliderState((prev) => ({ ...prev, previous: null }))
              }
            />
          </div>
        )}
        <div className="absolute inset-0">
          <FadeImage
            src={images[sliderState.current]}
            alt="Hero"
            animateIn={sliderState.previous !== null}
          />
        </div>

        <div
          className="
            z-50
            fixed bottom-0 left-0 w-full
            flex justify-center
            sm:absolute sm:bottom-auto sm:left-auto sm:top-4 sm:right-4 sm:w-auto
          "
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="
              w-full sm:w-auto
              bg-red-500 text-white 
              px-4 py-3 
              flex items-center justify-center 
              shadow-lg 
              text-xs sm:text-sm md:text-base 
              rounded-md
            "
          >
            <FaShoppingCart className="mr-2 text-sm sm:text-base md:text-lg" />
            <span>{items.length}</span>
            <div className="mx-3 h-4 sm:h-5 w-px bg-white"></div>
            <FaCreditCard className="mr-2 text-sm sm:text-base md:text-lg" />
            <span>Rs. {total}</span>
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden sm:flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => updateImage(index)}
              className={`w-3 h-3 rounded-full focus:outline-none ${
                sliderState.current === index ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-[-7px] left-0 w-full">
          <div className="w-full" style={{ aspectRatio: '1765.2256 / 102.3469' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1765.2256 102.3469"
              className="w-full h-full fill-yellow-400"
              preserveAspectRatio="none"
            >
              <path
                d="M0.2426 0 C378.8376 20.962 1108.2826 45.585 1765.2256 94.803 L0.2426 94.803 Z"
                style={{ pointerEvents: 'none' }}
              />
            </svg>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </section>
  )
}
