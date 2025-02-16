import Image from 'next/image';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative">
      <div className="bg-white text-center py-2">
        <h2 className="text-red-600 text-lg md:text-2xl font-semibold">
          Welcome Restaurant Name - Flat 10% Off on all Items
        </h2>
      </div>

      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4fvopJhL8eK6MCbvGjrEl8zGbNP62y0WCnQ&s"
          alt="Hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />

        <div className="absolute top-4 right-4 z-10">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center shadow-lg">
            <FaShoppingCart className="mr-1" />
            <span>1</span>

            <div className="mx-3 h-5 w-px bg-white"></div>

            <FaCreditCard className="mr-1" />
            <span>Rs. 750</span>
          </button>
        </div>

        <div className="absolute bottom-[-6px] left-0 w-full">
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
    </section>
  );
}
