"use client";

import { useEffect, useState } from "react";
import AddBranchForm from "./AddBranchForm";
import AddCategoryForm from "./CategoryForm";
import AddSubcategoryForm from "./SubcategoryForm";
import AddFoodItemForm from "./FoodItemForm";
import OrderList from "./OrderList";
import FoodItemList from "./FoodItemList";
import CategoryList from "./CategoryList";
import SubcategoryList from "./SubcategoryList";
import PromoCodesManager from "./PromoCodesManager";

export default function AdminPortal() {
  const [selectedTab, setSelectedTab] = useState("branch");
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetchBranches();
    fetchCategories();
    fetchSubcategories();
    fetchFoodItems();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/subcategories");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const res = await fetch("/api/fooditems");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  const addBranch = async (newBranch) => {
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranch),
      });
      if (res.ok) {
        const createdBranch = await res.json();
        setBranches((prev) => [...prev, createdBranch]);
      } else {
        console.error("Failed to add branch");
      }
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const addCategory = async (newCategory) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (res.ok) {
        const createdCategory = await res.json();
        setCategories((prev) => [...prev, createdCategory]);
      } else {
        console.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const addSubcategory = async (newSubcategory) => {
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubcategory),
      });
      if (res.ok) {
        const createdSubcategory = await res.json();
        setSubcategories((prev) => [...prev, createdSubcategory]);
      } else {
        console.error("Failed to add subcategory");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const addFoodItem = async (formData) => {
    try {
      const res = await fetch("/api/fooditems", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const createdFoodItem = await res.json();
        setFoodItems((prev) => [...prev, createdFoodItem]);
      } else {
        console.error("Failed to add food item");
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "branch":
        return <AddBranchForm addBranch={addBranch} />;
      case "category":
        return <AddCategoryForm branches={branches} addCategory={addCategory} />;
      case "subcategory":
        return (
          <AddSubcategoryForm
            branches={branches}
            categories={categories}
            addSubcategory={addSubcategory}
          />
        );
      case "foodItem":
        return (
          <AddFoodItemForm
            branches={branches}
            categories={categories}
            subcategories={subcategories}
            addFoodItem={addFoodItem}
          />
        );
      case "orders":
        return <OrderList />;
      case "items":
        return <FoodItemList />;
      case "allCategories":
        return <CategoryList />;
      case "allSubcategories":
        return <SubcategoryList />;
      case "promocodes":
        return <PromoCodesManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[92vh]">
        <div className="hidden md:block w-full md:w-1/4 bg-[#ba0000] text-white p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Admin Menu</h2>
          <ul className="space-y-2">
            {["branch", "category", "subcategory", "foodItem", "orders", "items", "allCategories", "allSubcategories", "promocodes"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setSelectedTab(tab)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition duration-150 ${
                    selectedTab === tab ? "bg-red-800" : "hover:bg-red-700"
                  }`}
                >
                  {tab.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="block md:hidden bg-[#ba0000] text-white p-4">
          <h2 className="text-lg font-semibold mb-2">Admin Menu</h2>
          <div className="flex overflow-x-auto space-x-2">
            {["branch", "category", "subcategory", "foodItem", "orders", "items", "allCategories", "allSubcategories", "promocodes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition duration-150 ${
                  selectedTab === tab ? "bg-red-800" : "hover:bg-red-700"
                }`}
              >
                {tab.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-3/4 p-4 overflow-y-auto">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-3xl font-bold capitalize text-[#ba0000]">
              {selectedTab.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}
            </h1>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
