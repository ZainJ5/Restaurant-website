import { useEffect, useState } from 'react';
import { useMenuStore } from '../../store/menu';

export default function Banner() {
  const activeCategory = useMenuStore((state) => state.activeCategory);
  const [categoryName, setCategoryName] = useState(null);

  const getId = (idField) => {
    if (typeof idField === 'object' && idField !== null) {
      if (idField.$oid) return idField.$oid;
      if (idField._id) return getId(idField._id);
    }
    return idField;
  };

  useEffect(() => {
    async function fetchCategoryName() {
      if (activeCategory) {
        try {
          const res = await fetch('/api/categories');
          const categories = await res.json();

          const matchedCategory = categories.find((cat) => {
            const catId = getId(cat._id);
            return catId === activeCategory;
          });

          setCategoryName(matchedCategory ? matchedCategory.name : null);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setCategoryName(null);
        }
      } else {
        setCategoryName(null);
      }
    }

    fetchCategoryName();
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
      {categoryName ? (
        <div className="h-24 sm:h-28 flex items-center justify-center bg-gradient-to-r from-red-800 to-red-600 rounded-md shadow-md">
          <h1 className="text-white text-4xl sm:text-5xl font-bold">
            {categoryName}
          </h1>
        </div>
      ) : (
        <div className="relative h-24 sm:h-28 rounded-md overflow-hidden shadow-md">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/bannar.webp')" }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xl sm:text-2xl font-semibold">
              Welcome!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
