import { useState, useEffect, useMemo } from 'react';
import { useMenuStore } from '../../store/menu';

export default function MenuTabs() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const { activeCategory, activeSubcategory, setActiveCategory, setActiveSubcategory } = useMenuStore();

  const getId = (idField) => {
    if (typeof idField === 'object' && idField !== null) {
      if (idField.$oid) return idField.$oid;
      if (idField._id) return getId(idField._id);
    }
    return idField;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        if (categoriesData.length > 0 && !activeCategory) {
          const firstCatId = getId(categoriesData[0]._id);
          setActiveCategory(firstCatId);
        }
        const subcategoriesRes = await fetch('/api/subcategories');
        const subcategoriesData = await subcategoriesRes.json();
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error fetching categories/subcategories:", error);
      }
    }
    fetchData();
  }, []);

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((sub) => {
      let subCatId;
      if (typeof sub.category === 'object' && sub.category !== null) {
        if (sub.category.$oid) subCatId = sub.category.$oid;
        else if (sub.category._id) subCatId = getId(sub.category._id);
        else subCatId = null;
      } else {
        subCatId = sub.category;
      }
      return subCatId === activeCategory;
    });
  }, [activeCategory, subcategories]);

  useEffect(() => {
    if (filteredSubcategories.length > 0) {
      const firstSubId = getId(filteredSubcategories[0]._id);
      setActiveSubcategory(firstSubId);
    } else {
      setActiveSubcategory(null);
    }
  }, [filteredSubcategories, setActiveSubcategory]);

  return (
    <>
      <div className="bg-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative flex items-center overflow-x-auto py-3"
            style={{
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
            }}
          >
            <style jsx>{`
              .no-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex items-center gap-3 mx-auto no-scroll">
              <button className="text-white shrink-0 focus:outline-none p-1">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {categories.map((cat) => {
                const catId = getId(cat._id);
                return (
                  <button
                    key={catId}
                    onClick={() => setActiveCategory(catId)}
                    className={
                      activeCategory === catId
                        ? 'bg-white text-black font-semibold px-4 py-1 rounded-lg whitespace-nowrap text-sm sm:text-base shrink-0 shadow-sm'
                        : 'border border-white text-white font-semibold px-4 py-1 rounded-lg whitespace-nowrap text-sm sm:text-base shrink-0 hover:bg-white/10 transition-colors'
                    }
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {filteredSubcategories.length > 0 && (
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-3 sm:gap-4">
              {filteredSubcategories.map((sub) => {
                const subId = getId(sub._id);
                return (
                  <button
                    key={subId}
                    onClick={() => setActiveSubcategory(subId)}
                    className={`${
                      activeSubcategory === subId
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'border border-black text-black hover:bg-gray-50'
                    } px-5 sm:px-6 py-1 rounded-2xl font-medium text-sm sm:text-[15px] transition-colors`}
                  >
                    {sub.name.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
