'use client';



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
        setFoodItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item");
    }
  };

  if (loading) return <p>Loading food items...</p>;

  return (
    <div className="space-y-4">
      {foodItems.length === 0 ? (
        <p>No food items available.</p>
      ) : (
        foodItems.map((item) => (
          <div key={item._id} className="border p-4 rounded flex items-center gap-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="font-semibold">{item.price}Rs</p>
            </div>
            <button
              onClick={() => deleteFoodItem(item._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
