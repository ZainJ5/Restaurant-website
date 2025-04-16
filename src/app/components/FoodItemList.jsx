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
    variations: [],
  });
  const [editImage, setEditImage] = useState(null);
  const [originalItemData, setOriginalItemData] = useState(null);

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
    setOriginalItemData(item);
    
    const categoryId = typeof item.category === "object" && item.category !== null
      ? extractValue(item.category._id)
      : extractValue(item.category);
      
    const subcategoryId = typeof item.subcategory === "object" && item.subcategory !== null
      ? extractValue(item.subcategory._id)
      : extractValue(item.subcategory);
      
    const branchId = typeof item.branch === "object" && item.branch !== null
      ? extractValue(item.branch._id)
      : extractValue(item.branch);
    
    setEditingItemId(extractValue(item._id));
    setEditData({
      title: item.title || "",
      description: item.description || "",
      price: item.price || "",
      category: categoryId || "",
      subcategory: subcategoryId || "",
      branch: branchId || "",
      variations: item.variations || [],
    });
    setEditImage(null);
    
    console.log("Edit data initialized:", {
      categoryId,
      subcategoryId,
      branchId
    });
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

  const handleVariationChange = (index, field, value) => {
    setEditData((prev) => {
      const updatedVariations = [...prev.variations];
      updatedVariations[index] = {
        ...updatedVariations[index],
        [field]: field === 'price' ? Number(value) : value
      };
      return {
        ...prev,
        variations: updatedVariations
      };
    });
  };

  const addVariation = () => {
    setEditData((prev) => ({
      ...prev,
      variations: [...prev.variations, { name: "", price: 0 }]
    }));
  };

  const removeVariation = (index) => {
    setEditData((prev) => {
      const updatedVariations = [...prev.variations];
      updatedVariations.splice(index, 1);
      return {
        ...prev,
        variations: updatedVariations
      };
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItemId) return;

    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("description", editData.description);
    
    if (!editData.variations || editData.variations.length === 0) {
      formData.append("price", editData.price);
    }

    const categoryId = editData.category || 
      (originalItemData && typeof originalItemData.category === "object" && originalItemData.category?._id 
        ? extractValue(originalItemData.category._id) 
        : extractValue(originalItemData?.category));
    
    const subcategoryId = editData.subcategory || 
      (originalItemData && typeof originalItemData.subcategory === "object" && originalItemData.subcategory?._id 
        ? extractValue(originalItemData.subcategory._id) 
        : extractValue(originalItemData?.subcategory));
    
    const branchId = editData.branch || 
      (originalItemData && typeof originalItemData.branch === "object" && originalItemData.branch?._id 
        ? extractValue(originalItemData.branch._id) 
        : extractValue(originalItemData?.branch));
    
    formData.append("category", categoryId);
    if (subcategoryId) {
      formData.append("subcategory", subcategoryId);
    }
    formData.append("branch", branchId);
    
    console.log("Submitting with category, subcategory, branch:", {
      categoryId,
      subcategoryId,
      branchId
    });
    
    if (editData.variations && editData.variations.length > 0) {
      const validVariations = editData.variations.filter(
        v => v.name && v.name.trim() !== "" && v.price !== null && v.price !== undefined
      );
      
      if (validVariations.length > 0) {
        formData.append("variations", JSON.stringify(validVariations));
      }
    }

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
          variations: [],
        });
        setOriginalItemData(null);
        setEditImage(null);
        fetchFoodItems();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to update item: ${errorData.message || "Unknown error"}`);
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
      variations: [],
    });
    setOriginalItemData(null);
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
                
                {(!editData.variations || editData.variations.length === 0) && (
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    placeholder="Price"
                    className="border p-2 w-full"
                  />
                )}
                
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
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Variations</h3>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                    >
                      Add Variation
                    </button>
                  </div>
                  
                  {editData.variations && editData.variations.length > 0 ? (
                    <div className="space-y-2">
                      {editData.variations.map((variation, index) => (
                        <div key={index} className="flex flex-wrap gap-2 items-center p-2 border rounded">
                          <input
                            type="text"
                            value={variation.name || ""}
                            onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                            placeholder="Variation Name"
                            className="flex-1 border p-2 min-w-[150px]"
                          />
                          <input
                            type="number"
                            value={variation.price || 0}
                            onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                            placeholder="Price"
                            className="w-24 border p-2"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariation(index)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No variations added</p>
                  )}
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
              {(!item.variations || item.variations.length === 0) && (
                <p className="font-semibold">{price} Rs</p>
              )}
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