import { useEffect } from 'react';
import { useMenuStore } from '../../store/menu';

export default function Banner() {
  const activeCategory = useMenuStore((state) => state.activeCategory);
  const activeCategoryName = useMenuStore((state) => state.activeCategoryName);
  const setActiveCategoryName = useMenuStore((state) => state.setActiveCategoryName);

  useEffect(() => {
    console.log("Active Category Name from store:", activeCategoryName);
  }, [activeCategoryName]);

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
            const activeCatId = typeof activeCategory === 'object' ? getId(activeCategory._id) : activeCategory;
            return catId === activeCatId;
          });

          setActiveCategoryName(matchedCategory ? matchedCategory.name : null);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setActiveCategoryName(null);
        }
      } else {
        setActiveCategoryName(null);
      }
    }

    fetchCategoryName();
  }, [activeCategory, setActiveCategoryName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
      {activeCategoryName ? (
        <div className="relative w-full aspect-[1500/287]"> 

          <img
            src={`/${activeCategoryName}.webp`}
            alt={`${activeCategoryName} banner`}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="h-16 sm:h-20 flex items-center justify-center bg-gray-200 rounded-md shadow-md">
          <h1 className="text-black text-xl sm:text-2xl font-bold">
            Loading...
          </h1>
        </div>
      )}
    </div>
  );
}
