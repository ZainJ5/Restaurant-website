'use client'

import { useEffect, useState } from "react";
import AddCategoryForm from "./CategoryForm";
import AddSubcategoryForm from "./SubcategoryForm";
import AddFoodItemForm from "./FoodItemForm";
import OrderList from "./OrderList";
import FoodItemList from "./FoodItemList";
import CategoryList from "./CategoryList";
import SubcategoryList from "./SubcategoryList";

export default function AdminPortal() {
  const [selectedTab, setSelectedTab] = useState("category");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchFoodItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/subcategories");
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const res = await fetch("/api/fooditems");
      const data = await res.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
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
      case "category":
        return <AddCategoryForm addCategory={addCategory} />;
      case "subcategory":
        return (
          <AddSubcategoryForm
            categories={categories}
            addSubcategory={addSubcategory}
          />
        );
      case "foodItem":
        return (
          <AddFoodItemForm
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-auto md:h-[80vh]">
        <div className={`w-full md:w-1/4 bg-blue-600 text-white p-6 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
          <h2 className="text-2xl font-bold mb-6">Admin Menu</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setSelectedTab("category")}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedTab === "category"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                Add Category
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("subcategory")}
                className={`w-full text-left px-4 py-2 rounded ${
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
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedTab === "foodItem"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                Add Food Item
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("orders")}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedTab === "orders"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("items")}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedTab === "items"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                All Items
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("allCategories")}
                className={`w-full text-left px-4 py-2 rounded ${
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
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedTab === "allSubcategories"
                    ? "bg-blue-800"
                    : "hover:bg-blue-700"
                }`}
              >
                All Subcategories
              </button>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-3/4 p-8 overflow-y-auto">
          <div className="block md:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isSidebarOpen ? "Close Menu" : "Open Menu"}
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-6 capitalize">
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
              : "Add Category"}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
