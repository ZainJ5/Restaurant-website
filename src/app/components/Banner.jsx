import { useEffect, useState } from 'react';
import { useMenuStore } from '../../store/menu';

export default function Banner() {
  const activeCategory = useMenuStore((state) => state.activeCategory);
  const activeCategoryName = useMenuStore((state) => state.activeCategoryName);
  const activeSubcategory = useMenuStore((state) => state.activeSubcategory);
  const setActiveCategoryName = useMenuStore((state) => state.setActiveCategoryName);

  const [activeSubcategoryName, setActiveSubcategoryName] = useState(null);

  useEffect(() => {
  }, [activeCategory, activeSubcategory, activeCategoryName]);

  const getId = (idField) => {
    if (typeof idField === 'object' && idField !== null) {
      if (idField.$oid) return idField.$oid;
      if (idField._id) return getId(idField._id);
    }
    return idField;
  };

  useEffect(() => {
    async function fetchNames() {
      if (!activeCategory) {
        setActiveCategoryName(null);
        setActiveSubcategoryName(null);
        return;
      }
      try {
        const catRes = await fetch('/api/categories');
        const categoriesData = await catRes.json();
        const activeCatId = typeof activeCategory === 'object' ? getId(activeCategory._id) : activeCategory;
        const matchedCategory = categoriesData.find(cat => getId(cat._id) === activeCatId);
        const catName = matchedCategory ? matchedCategory.name : null;
        setActiveCategoryName(catName);

        if (activeSubcategory) {
          const subRes = await fetch('/api/subcategories');
          const subcategoriesData = await subRes.json();
          const activeSubcatId = typeof activeSubcategory === 'object' ? getId(activeSubcategory._id) : activeSubcategory;
          const matchedSubcategory = subcategoriesData.find(sub => getId(sub._id) === activeSubcatId);
          if (matchedSubcategory) {
            setActiveSubcategoryName(matchedSubcategory.name);
            console.log("Fetched Subcategory Name:", matchedSubcategory.name);
          } else {
            setActiveSubcategoryName(null);
          }
        } else {
          setActiveSubcategoryName(null);
        }
      } catch (error) {
        console.error("Error fetching category or subcategory data:", error);
        setActiveCategoryName(null);
        setActiveSubcategoryName(null);
      }
    }
    fetchNames();
  }, [activeCategory, activeSubcategory, setActiveCategoryName]);

  const bannerToShow = activeSubcategoryName || activeCategoryName;
  const bannerAltText = activeSubcategoryName
    ? `${activeSubcategoryName} subcategory banner`
    : `${activeCategoryName} category banner`;

  useEffect(() => {
    if (bannerToShow) {
      console.log(`Attempting to load banner image: ${bannerToShow}.webp with alt text: "${bannerAltText}"`);
    }
  }, [bannerToShow, bannerAltText]);

  const handleImageLoad = () => {
    console.log(`Successfully loaded banner image: ${bannerToShow}.webp`);
  };

  const handleImageError = () => {
    console.error(`Error loading banner image: ${bannerToShow}.webp`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
      {bannerToShow ? (
        <div className="relative w-full">
          <img
            src={`/${bannerToShow}.webp`}
            alt={bannerAltText}
            className="w-full h-auto object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="h-32 sm:h-20 flex items-center justify-center bg-gray-200 rounded-md shadow-md">
          <h1 className="text-black text-xl sm:text-2xl font-bold">Loading...</h1>
        </div>
      )}
    </div>
  );
}