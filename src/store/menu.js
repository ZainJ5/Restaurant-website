import { create } from 'zustand';

export const useMenuStore = create((set) => ({
  activeCategory: null,
  activeSubcategory: null,
  setActiveCategory: (catId) => set({ activeCategory: catId }),
  setActiveSubcategory: (subId) => set({ activeSubcategory: subId }),
}));
