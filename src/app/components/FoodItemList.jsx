"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FoodItemList() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    branch: "",
  });
  const [editImage, setEditImage] = useState(null);

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

  const handleEditClick = (item) => {
    setEditingItemId(extractValue(item._id));
    setEditData({
      title: item.title || "",
      description: item.description || "",
      price: item.price || "",
      category:
        typeof item.category === "object" && item.category._id
          ? item.category._id
          : item.category || "",
      subcategory:
        typeof item.subcategory === "object" && item.subcategory._id
          ? item.subcategory._id
          : item.subcategory || "",
      branch:
        typeof item.branch === "object" && item.branch._id
          ? item.branch._id
          : item.branch || "",
    });
    setEditImage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImage(e.target.files[0]);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItemId) return;

    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("description", editData.description);
    formData.append("price", editData.price);
    formData.append("category", editData.category);
    formData.append("subcategory", editData.subcategory);
    formData.append("branch", editData.branch);

    if (editImage) {
      formData.append("foodImage", editImage);
    }

    try {
      const res = await fetch(`/api/fooditems/${editingItemId}`, {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        toast.success("Item updated successfully");
        setEditingItemId(null);
        setEditData({
          title: "",
          description: "",
          price: "",
          category: "",
          subcategory: "",
          branch: "",
        });
        setEditImage(null);
        fetchFoodItems();
      } else {
        toast.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error updating item");
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditData({
      title: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
      branch: "",
    });
    setEditImage(null);
  };

  if (loading) return <p>Loading food items...</p>;
  if (foodItems.length === 0) return <p>No food items available.</p>;

  return (
    <div className="space-y-4 p-4">
      {foodItems.map((item) => {
        const id = extractValue(item._id);
        const price = extractValue(item.price);

        if (editingItemId === id) {
          return (
            <div key={id} className="border p-4 rounded">
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  placeholder="Title"
                  className="border p-2 w-full"
                />
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="border p-2 w-full"
                ></textarea>
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleEditChange}
                  placeholder="Price"
                  className="border p-2 w-full"
                />
                <div>
                  <label className="block text-sm font-semibold">
                    Category ID (not editable)
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={editData.category}
                    disabled
                    className="border p-2 w-full bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Subcategory ID (not editable)
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={editData.subcategory}
                    disabled
                    className="border p-2 w-full bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Branch ID (not editable)
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={editData.branch}
                    disabled
                    className="border p-2 w-full bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Update Image (optional)
                  </label>
                  <input
                    type="file"
                    name="foodImage"
                    onChange={handleImageChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          );
        }

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
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteFoodItem(id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
