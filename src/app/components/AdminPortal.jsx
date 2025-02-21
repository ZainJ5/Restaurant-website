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
    <div className="min-h-screen text-black bg-gray-100 p-2 sm:p-4 md:p-6">
      <style jsx global>{`
        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c5d1eb;
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9aaed8;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #c5d1eb #f1f1f1;
        }
        .sidebar {
          max-height: 100%;
          overflow-y: auto;
        }
        .content-scroll {
          overflow-y: auto;
        }
      `}</style>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-[92vh] sm:h-[90vh] md:h-[85vh]">
        {/* Sidebar for medium and larger devices */}
        <div className="hidden md:block sidebar w-full md:w-1/4 lg:w-1/5 bg-blue-600 text-white p-4 transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-bold mb-4 px-2 sticky top-0 bg-blue-600 pt-1 z-10">
            Admin Menu
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedTab("branch")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "branch" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Add Branch
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("category")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "category" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Add Category
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("subcategory")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "subcategory"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                Add Subcategory
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("foodItem")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "foodItem" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Add Food Item
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("orders")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "orders" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("items")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "items" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                All Items
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("allCategories")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "allCategories"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                All Categories
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("allSubcategories")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "allSubcategories"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                All Subcategories
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("promocodes")}
                className={`w-full text-left px-3 py-2 rounded text-sm transition duration-150 ${
                  selectedTab === "promocodes"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                Promo Codes
              </button>
            </li>
          </ul>
        </div>

        {/* Horizontal navigation for small devices */}
        <div className="block md:hidden bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold mb-2">Admin Menu</h2>
          <div className="flex overflow-x-auto space-x-2">
            {[
              { key: "branch", label: "Add Branch" },
              { key: "category", label: "Add Category" },
              { key: "subcategory", label: "Add Subcategory" },
              { key: "foodItem", label: "Add Food Item" },
              { key: "orders", label: "Orders" },
              { key: "items", label: "All Items" },
              { key: "allCategories", label: "All Categories" },
              { key: "allSubcategories", label: "All Subcategories" },
              { key: "promocodes", label: "Promo Codes" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-3 py-2 rounded text-sm transition duration-150 whitespace-nowrap ${
                  selectedTab === tab.key
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 lg:w-4/5 p-4 sm:p-6 md:p-8 content-scroll">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
              {selectedTab === "foodItem"
                ? "Add Food Item"
                : selectedTab === "subcategory"
                ? "Add Subcategory"
                : selectedTab === "orders"
                ? "Received Orders"
                : selectedTab === "items"
                ? "All Items"
                : selectedTab === "allCategories"
                ? "All Categories"
                : selectedTab === "allSubcategories"
                ? "All Subcategories"
                : selectedTab === "branch"
                ? "Add Branch"
                : selectedTab === "category"
                ? "Add Category"
                : selectedTab === "promocodes"
                ? "Promo Codes"
                : null}
            </h1>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
