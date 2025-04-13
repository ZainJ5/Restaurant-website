"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useMenuStore } from '../../store/menu';

const DEFAULT_BANNER = "Hot deals";

export default function Banner() {
  const activeCategory = useMenuStore((state) => state.activeCategory);
  const activeCategoryName = useMenuStore((state) => state.activeCategoryName);
  const activeSubcategory = useMenuStore((state) => state.activeSubcategory);
  const setActiveCategoryName = useMenuStore((state) => state.setActiveCategoryName);

  const [activeSubcategoryName, setActiveSubcategoryName] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bannerData, setBannerData] = useState({
    src: `/${DEFAULT_BANNER}.webp`,
    alt: `${DEFAULT_BANNER} banner`,
    isLoading: false,
    hasError: false
  });

  const categoriesCache = useRef(null);
  const subcategoriesCache = useRef(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getId = useCallback((idField) => {
    if (!idField) return null;
    if (typeof idField === 'object' && idField !== null) {
      return idField.$oid || (idField._id ? getId(idField._id) : idField);
    }
    return idField;
  }, []);

  const fetchDataOnce = useCallback(async (type) => {
    const cacheRef = type === 'categories' ? categoriesCache : subcategoriesCache;
    
    if (cacheRef.current) {
      return cacheRef.current;
    }
    
    cacheRef.current = fetch(`/api/${type}`)
      .then(res => res.json())
      .catch(error => {
        console.error(`Error fetching ${type}:`, error);
        cacheRef.current = null;
        return [];
      });
    
    return cacheRef.current;
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function updateBannerData() {
      if (!activeCategory) {
        if (isMounted) {
          setActiveCategoryName(null);
          setActiveSubcategoryName(null);
          
          if (!isMobile) {
            setBannerData({
              src: `/${DEFAULT_BANNER}.webp`,
              alt: `${DEFAULT_BANNER} banner`,
              isLoading: false,
              hasError: false
            });
          }
        }
        return;
      }

      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          fetchDataOnce('categories'),
          fetchDataOnce('subcategories')
        ]);

        if (!isMounted) return;

        const activeCatId = getId(activeCategory);
        const matchedCategory = categoriesData?.find(cat => getId(cat._id) === activeCatId);
        const catName = matchedCategory ? matchedCategory.name : null;
        
        if (isMounted) {
          setActiveCategoryName(catName);
        }

        if (activeSubcategory && subcategoriesData) {
          const activeSubcatId = getId(activeSubcategory);
          const matchedSubcategory = subcategoriesData.find(
            sub => getId(sub._id) === activeSubcatId
          );
          
          if (isMounted) {
            setActiveSubcategoryName(matchedSubcategory?.name || null);
          }
        } else if (isMounted) {
          setActiveSubcategoryName(null);
        }

        if (isMounted && !isMobile) {
          const bannerName = activeSubcategoryName || catName || DEFAULT_BANNER;
          const bannerAlt = activeSubcategoryName
            ? `${activeSubcategoryName} subcategory banner`
            : catName 
              ? `${catName} category banner` 
              : `${DEFAULT_BANNER} banner`;
          
          setBannerData({
            src: `/${bannerName}.webp`,
            alt: bannerAlt,
            isLoading: false,
            hasError: false
          });
        }
      } catch (error) {
        console.error("Error processing data:", error);
        if (isMounted) {
          setActiveCategoryName(null);
          setActiveSubcategoryName(null);
        }
      }
    }

    updateBannerData();
    return () => { isMounted = false; };
  }, [activeCategory, activeSubcategory, setActiveCategoryName, fetchDataOnce, getId, isMobile, activeSubcategoryName]);

  useEffect(() => {
    if (isMobile) return;
    
    const bannerName = activeSubcategoryName || activeCategoryName || DEFAULT_BANNER;
    const bannerAlt = activeSubcategoryName
      ? `${activeSubcategoryName} subcategory banner`
      : activeCategoryName 
        ? `${activeCategoryName} category banner` 
        : `${DEFAULT_BANNER} banner`;
    
    setBannerData({
      src: `/${bannerName}.webp`,
      alt: bannerAlt,
      isLoading: false,
      hasError: false
    });
  }, [activeSubcategoryName, activeCategoryName, isMobile]);

  if (isMobile) {
    const bannerName = activeSubcategoryName || activeCategoryName || DEFAULT_BANNER;
    const bannerAlt = activeSubcategoryName
      ? `${activeSubcategoryName} subcategory banner`
      : activeCategoryName 
        ? `${activeCategoryName} category banner` 
        : `${DEFAULT_BANNER} banner`;
      
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
        <div className="relative w-full">
          <img
            src={`/${bannerName}.webp`}
            alt={bannerAlt}
            className="w-full h-auto rounded-md object-contain"
            onError={(e) => {
              console.error(`Failed to load banner image: ${bannerName}.webp`);
              const parent = e.target.parentNode;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'h-32 w-full flex items-center justify-center bg-gray-200 rounded-md';
                fallback.innerHTML = `<span class="text-black font-bold">${bannerName}</span>`;
                
                parent.replaceChild(fallback, e.target);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
      <div className="relative w-full h-auto min-h-[180px] bg-gray-200 rounded-md overflow-hidden">
        {bannerData.hasError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-black font-bold">
              {activeSubcategoryName || activeCategoryName || DEFAULT_BANNER}
            </span>
          </div>
        ) : (
          <img
            src={bannerData.src}
            alt={bannerData.alt}
            className="w-full h-auto object-contain rounded-md"
            onError={(e) => {
              console.error(`Failed to load banner image: ${bannerData.src}`);
              setBannerData(prev => ({
                ...prev,
                hasError: true
              }));
            }}
          />
        )}
      </div>
    </div>
  );
}