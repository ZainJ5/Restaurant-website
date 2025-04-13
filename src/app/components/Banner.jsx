import { useEffect, useState, useCallback } from 'react';
import { useMenuStore } from '../../store/menu';

const cache = {
  categories: null,
  subcategories: null,
  lastFetch: {
    categories: 0,
    subcategories: 0
  }
};

const CACHE_DURATION = 5 * 60 * 1000; 

export default function Banner() {
  const activeCategory = useMenuStore((state) => state.activeCategory);
  const activeCategoryName = useMenuStore((state) => state.activeCategoryName);
  const activeSubcategory = useMenuStore((state) => state.activeSubcategory);
  const setActiveCategoryName = useMenuStore((state) => state.setActiveCategoryName);

  const [activeSubcategoryName, setActiveSubcategoryName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [bannerState, setBannerState] = useState({
    src: null,
    alt: null,
    isVisible: false,
    isLoaded: false,
    isError: false,
    key: 0 
  });
  
  const [currentBannerName, setCurrentBannerName] = useState(null);
  
  const getId = useCallback((idField) => {
    if (!idField) return null;
    if (typeof idField === 'object' && idField !== null) {
      return idField.$oid || (idField._id ? getId(idField._id) : idField);
    }
    return idField;
  }, []);

  const fetchData = useCallback(async (endpoint, cacheKey) => {
    const now = Date.now();
    if (cache[cacheKey] && (now - cache.lastFetch[cacheKey]) < CACHE_DURATION) {
      return cache[cacheKey]; 
    }
    
    try {
      const res = await fetch(`/api/${endpoint}`);
      const data = await res.json();
      cache[cacheKey] = data;
      cache.lastFetch[cacheKey] = now;
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  }, []);

  useEffect(() => {
    async function updateNames() {
      setIsLoading(true);
      
      if (!activeCategory) {
        setActiveCategoryName(null);
        setActiveSubcategoryName(null);
        setIsLoading(false);
        return;
      }

      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          fetchData('categories', 'categories'),
          fetchData('subcategories', 'subcategories')
        ]);

        const activeCatId = getId(activeCategory);
        const matchedCategory = categoriesData?.find(cat => getId(cat._id) === activeCatId);
        const catName = matchedCategory ? matchedCategory.name : null;
        setActiveCategoryName(catName);

        if (activeSubcategory && subcategoriesData) {
          const activeSubcatId = getId(activeSubcategory);
          const matchedSubcategory = subcategoriesData.find(
            sub => getId(sub._id) === activeSubcatId
          );
          setActiveSubcategoryName(matchedSubcategory?.name || null);
        } else {
          setActiveSubcategoryName(null);
        }
      } catch (error) {
        console.error("Error processing data:", error);
        setActiveCategoryName(null);
        setActiveSubcategoryName(null);
      } finally {
        setIsLoading(false);
      }
    }

    updateNames();
  }, [activeCategory, activeSubcategory, setActiveCategoryName, fetchData, getId]);

  useEffect(() => {
    const bannerToShow = activeSubcategoryName || activeCategoryName;
    
    if (bannerToShow === currentBannerName) {
      return;
    }
    
    setCurrentBannerName(bannerToShow);
    
    setBannerState(prev => ({
      ...prev,
      isVisible: false
    }));
    
    if (bannerToShow) {
      setTimeout(() => {
        const newBanner = {
          src: `/${bannerToShow}.webp`,
          alt: activeSubcategoryName
            ? `${activeSubcategoryName} subcategory banner`
            : `${activeCategoryName} category banner`,
          isVisible: false,
          isLoaded: false,
          isError: false,
          key: Date.now() 
        };
        
        setBannerState(newBanner);
        
        const img = new Image();
        img.src = newBanner.src;
        
        img.onload = () => {
          setBannerState(prev => ({
            ...prev,
            isLoaded: true,
            isVisible: true,
            isError: false
          }));
        };
        
        img.onerror = () => {
          setBannerState(prev => ({
            ...prev,
            isLoaded: false,
            isVisible: false,
            isError: true
          }));
        };
      }, 300);
    } else {
      setBannerState({
        src: null,
        alt: null,
        isVisible: false,
        isLoaded: false,
        isError: false,
        key: Date.now()
      });
    }
  }, [activeSubcategoryName, activeCategoryName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
      <div className="relative w-full h-auto min-h-[180px] bg-gray-200 rounded-md overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-black text-xl sm:text-2xl font-bold">Loading...</div>
          </div>
        ) : bannerState.src && !bannerState.isError ? (
          <img
            key={bannerState.key}
            src={bannerState.src}
            alt={bannerState.alt}
            className="w-full h-auto object-contain rounded-md"
            style={{
              opacity: bannerState.isVisible ? 1 : 0,
              transition: 'opacity 400ms ease-in-out'
            }}
            onLoad={() => {
              setBannerState(prev => ({ ...prev, isLoaded: true, isVisible: true }));
            }}
            onError={() => {
              setBannerState(prev => ({ ...prev, isError: true }));
            }}
          />
        ) : bannerState.isError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-black text-xl sm:text-2xl font-bold">Banner unavailable</div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-black text-xl sm:text-2xl font-bold">No banner selected</div>
          </div>
        )}
      </div>
    </div>
  );
}