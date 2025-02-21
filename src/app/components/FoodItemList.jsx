"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FoodItemList() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fooditems");
      const data = await res.json();
      console.log("Fetched food items:", data);
      setFoodItems(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Error fetching food items");
    } finally {
      setLoading(false);
    }
  };

  const deleteFoodItem = async (id) => {
    try {
      const res = await fetch(`/api/fooditems/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Item deleted successfully");
        setFoodItems((prev) =>
          prev.filter((item) => extractValue(item._id) !== id)
        );
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item");
    }
  };

  // Helper to extract values from MongoDB's nested types
  const extractValue = (field) => {
    if (typeof field === "object" && field !== null) {
      if (field.$numberInt) {
        return parseInt(field.$numberInt, 10);
      }
      if (field.$oid) {
        return field.$oid;
      }
    }
    return field;
  };

  if (loading) return <p>Loading food items...</p>;
  if (foodItems.length === 0) return <p>No food items available.</p>;

  return (
    <div className="space-y-4 p-4">
      {foodItems.map((item) => {
        const id = extractValue(item._id);
        const price = extractValue(item.price);
        return (
          <div
            key={id}
            className="border p-4 rounded flex flex-col md:flex-row items-center gap-4"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}

            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="font-semibold">{price} Rs</p>

              {item.branch &&
              typeof item.branch === "object" &&
              item.branch.name ? (
                <p className="text-sm text-gray-600">
                  Branch: {item.branch.name}
                </p>
              ) : (
                item.branch && (
                  <p className="text-sm text-gray-600">
                    Branch: {extractValue(item.branch)}
                  </p>
                )
              )}

              {item.category &&
              typeof item.category === "object" &&
              item.category.name ? (
                <p className="text-sm text-gray-600">
                  Category: {item.category.name}
                </p>
              ) : (
                item.category && (
                  <p className="text-sm text-gray-600">
                    Category: {extractValue(item.category)}
                  </p>
                )
              )}

              {item.subcategory &&
              typeof item.subcategory === "object" &&
              item.subcategory.name ? (
                <p className="text-sm text-gray-600">
                  Subcategory: {item.subcategory.name}
                </p>
              ) : (
                item.subcategory && (
                  <p className="text-sm text-gray-600">
                    Subcategory: {extractValue(item.subcategory)}
                  </p>
                )
              )}

              {item.variations && item.variations.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Variations:</p>
                  <ul className="list-disc pl-5">
                    {item.variations.map((variation, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {variation.name} - {extractValue(variation.price)} Rs
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteFoodItem(id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full md:w-auto"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
