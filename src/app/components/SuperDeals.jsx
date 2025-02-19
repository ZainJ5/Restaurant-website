import Image from 'next/image'
import { useCart } from '../context/CartContext'

export default function SuperDeals({ searchQuery }) {
  const deals = [
    {
      id: 1,
      title: 'Super Deal 1',
      items: ['1 Chicken Tikka', '1 Chicken Roll', '1 Regular Drink'],
      price: 250,
      image: '/Chicken Chatni Roll.webp'
    },
    {
      id: 2,
      title: 'Super Deal 2',
      items: ['1 Chicken Tikka', '1 Chicken Roll', '1 Regular Drink'],
      price: 250,
      image: '/Chicken Kabab Fry.webp'
    },
    {
      id: 3,
      title: 'Super Deal 3',
      items: ['1 Chicken Tikka', '1 Chicken Roll', '1 Regular Drink'],
      price: 250,
      image: '/Chicken Malai Tikka.webp'
    },
    {
      id: 4,
      title: 'Super Deal 4',
      items: ['1 Chicken Tikka', '1 Chicken Roll', '1 Regular Drink'],
      price: 250,
      image: '/Chicken Sajji With Fries.webp'
    },
    {
      id: 5,
      title: 'Super Deal 5',
      items: ['1 Chicken Tikka', '1 Chicken Roll', '1 Regular Drink'],
      price: 250,
      image: '/Chicken Tikka.png'
    },
    {
      id: 6,
      title: 'Super Deal 6',
      items: ['1 Chicken Tikka', '1 Chicken Roll', '1 Regular Drink'],
      price: 250,
      image: '/Chicken Sajji With Masala.webp'
    }
  ]

  const { addToCart } = useCart()

  const filteredDeals = deals.filter((deal) => {
    const lowerQuery = searchQuery.toLowerCase()
    const titleMatch = deal.title.toLowerCase().includes(lowerQuery)
    const itemsMatch = deal.items.some((item) =>
      item.toLowerCase().includes(lowerQuery)
    )
    return titleMatch || itemsMatch
  })

  const handleAddToCart = (deal) => {
    addToCart(deal)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 mb-16">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-2 sm:p-3 md:p-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                {deal.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                {deal.items.join(', ')}
              </p>
              <div className="mt-2 sm:mt-4 flex justify-between items-center">
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  Rs.{deal.price}
                </span>
                <button
                  onClick={() => handleAddToCart(deal)}
                  className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
