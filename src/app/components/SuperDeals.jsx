import Image from 'next/image';
import { useCartStore } from '../../store/cart';
import { useEffect, useState } from 'react';
import { useMenuStore } from '../../store/menu';
import { toast } from 'react-toastify';

export default function SuperDeals({ searchQuery }) {
  const [items, setItems] = useState([]);
  const { addToCart } = useCartStore();
  const activeCategory = useMenuStore((state) => state.activeCategory);
  const activeSubcategory = useMenuStore((state) => state.activeSubcategory);

  const getId = (idField) => {
    if (typeof idField === 'object' && idField !== null) {
      if (idField.$oid) return idField.$oid;
      if (idField._id) return getId(idField._id);
    }
    return idField;
  };

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('/api/fooditems');
        const data = await res.json();
        console.log("Fetched items:", data);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
    fetchItems();
  }, []);
  
  const lowerQuery = searchQuery.toLowerCase();

  const filteredItems = items.filter(item => {
    const itemCategory = getId(item.category);
    const categoryMatch = activeCategory ? (itemCategory === activeCategory) : false;
    
    const itemSubcategory = getId(item.subcategory);
    const subcategoryMatch = activeSubcategory ? (itemSubcategory === activeSubcategory) : false;
    
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const itemsMatch = item.items &&
      Array.isArray(item.items) &&
      item.items.some(i => i.toLowerCase().includes(lowerQuery));
    
    return categoryMatch && subcategoryMatch && (titleMatch || itemsMatch);
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success("Successfully added to cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 mb-16">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 w-full">
              {item.imageUrl && item.imageUrl !== '' ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="p-2 sm:p-3 md:p-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                  {item.description}
                </p>
              )}
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                {Array.isArray(item.items) ? item.items.join(', ') : ''}
              </p>
              <div className="mt-2 sm:mt-4 flex justify-between items-center">
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  Rs.{item.price}
                </span>
                <button
                  onClick={() => handleAddToCart(item)}
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
  );
}
