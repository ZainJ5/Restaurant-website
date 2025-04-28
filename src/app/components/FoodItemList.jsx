"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FoodItemList() {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    branch: "",
    category: "",
    subcategory: "",
    search: "",
  });
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchBranches();
    fetchCategories();
    fetchSubcategories();
    fetchFoodItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, foodItems]);

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
    setLoading(true);
    try {
      const res = await fetch("/api/fooditems");
      const data = await res.json();
      setFoodItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Error fetching food items");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...foodItems];
    const { branch, category, subcategory, search } = filters;

    if (branch) {
      filtered = filtered.filter(
        (item) => extractValue(item.branch?._id || item.branch) === branch
      );
    }
    if (category) {
      filtered = filtered.filter(
        (item) => extractValue(item.category?._id || item.category) === category
      );
    }
    if (subcategory) {
      filtered = filtered.filter(
        (item) =>
          extractValue(item.subcategory?._id || item.subcategory) === subcategory
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ branch: "", category: "", subcategory: "", search: "" });
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
        setShowDeleteConfirm(null);
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
      if (field.$numberInt) return parseInt(field.$numberInt, 10);
      if (field.$oid) return field.$oid;
    }
    return field;
  };

  const handleEditClick = (item) => {
    setOriginalItemData(item);
    const categoryId =
      typeof item.category === "object" && item.category !== null
        ? extractValue(item.category._id)
        : extractValue(item.category);
    const subcategoryId =
      typeof item.subcategory === "object" && item.subcategory !== null
        ? extractValue(item.subcategory._id)
        : extractValue(item.subcategory);
    const branchId =
      typeof item.branch === "object" && item.branch !== null
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
        [field]: field === "price" ? Number(value) : value,
      };
      return {
        ...prev,
        variations: updatedVariations,
      };
    });
  };

  const addVariation = () => {
    setEditData((prev) => ({
      ...prev,
      variations: [...prev.variations, { name: "", price: 0 }],
    }));
  };

  const removeVariation = (index) => {
    setEditData((prev) => {
      const updatedVariations = [...prev.variations];
      updatedVariations.splice(index, 1);
      return {
        ...prev,
        variations: updatedVariations,
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

    const categoryId =
      editData.category ||
      (originalItemData &&
      typeof originalItemData.category === "object" &&
      originalItemData.category?._id
        ? extractValue(originalItemData.category._id)
        : extractValue(originalItemData?.category));
    const subcategoryId =
      editData.subcategory ||
      (originalItemData &&
      typeof originalItemData.subcategory === "object" &&
      originalItemData.subcategory?._id
        ? extractValue(originalItemData.subcategory._id)
        : extractValue(originalItemData?.subcategory));
    const branchId =
      editData.branch ||
      (originalItemData &&
      typeof originalItemData.branch === "object" &&
      originalItemData.branch?._id
        ? extractValue(originalItemData.branch._id)
        : extractValue(originalItemData?.branch));

    formData.append("category", categoryId);
    if (subcategoryId) formData.append("subcategory", subcategoryId);
    formData.append("branch", branchId);

    if (editData.variations && editData.variations.length > 0) {
      const validVariations = editData.variations.filter(
        (v) => v.name && v.name.trim() !== "" && v.price !== null && v.price !== undefined
      );
      if (validVariations.length > 0) {
        formData.append("variations", JSON.stringify(validVariations));
      }
    }

    if (editImage) formData.append("foodImage", editImage);

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

  if (loading) return <p className="text-center text-gray-600">Loading food items...</p>;
  if (foodItems.length === 0) return <p className="text-center text-gray-600">No food items available.</p>;

  return (
    <div className="space-y-6 p-6">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={extractValue(branch._id)} value={extractValue(branch._id)}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={extractValue(category._id)} value={extractValue(category._id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              name="subcategory"
              value={filters.subcategory}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={extractValue(subcategory._id)} value={extractValue(subcategory._id)}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150"
        >
          Reset Filters
        </button>
      </div>

      {/* Food Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const id = extractValue(item._id);
          const price = extractValue(item.price);

          if (editingItemId === id) {
            return (
              <div key={id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      placeholder="Title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      placeholder="Description"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></textarea>
                  </div>
                  {(!editData.variations || editData.variations.length === 0) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={handleEditChange}
                        placeholder="Price"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category ID (not editable)</label>
                    <input
                      type="text"
                      name="category"
                      value={editData.category}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subcategory ID (not editable)</label>
                    <input
                      type="text"
                      name="subcategory"
                      value={editData.subcategory}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch ID (not editable)</label>
                    <input
                      type="text"
                      name="branch"
                      value={editData.branch}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Variations</h3>
                      <button
                        type="button"
                        onClick={addVariation}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-150"
                      >
                        Add Variation
                      </button>
                    </div>
                    {editData.variations && editData.variations.length > 0 ? (
                      <div className="space-y-2">
                        {editData.variations.map((variation, index) => (
                          <div
                            key={index}
                            className="flex flex-wrap gap-2 items-center p-2 border rounded-md"
                          >
                            <input
                              type="text"
                              value={variation.name || ""}
                              onChange={(e) => handleVariationChange(index, "name", e.target.value)}
                              placeholder="Variation Name"
                              className="flex-1 border p-2 rounded-md min-w-[150px]"
                            />
                            <input
                              type="number"
                              value={variation.price || 0}
                              onChange={(e) =>
                                handleVariationChange(index, "price", e.target.value)
                              }
                              placeholder="Price"
                              className="w-24 border p-2 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariation(index)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-150"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Update Image (optional)
                    </label>
                    <input
                      type="file"
                      name="foodImage"
                      onChange={handleImageChange}
                      className="mt-1 block w-full rounded-md border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-150"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-150"
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
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row items-center gap-4"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {(!item.variations || item.variations.length === 0) && (
                  <p className="font-semibold text-gray-800">{price} Rs</p>
                )}
                {item.branch &&
                typeof item.branch === "object" &&
                item.branch.name ? (
                  <p className="text-sm text-gray-600">Branch: {item.branch.name}</p>
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
                  <p className="text-sm text-gray-600">Category: {item.category.name}</p>
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
                    <p className="font-semibold text-gray-800">Variations:</p>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteFoodItem(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}