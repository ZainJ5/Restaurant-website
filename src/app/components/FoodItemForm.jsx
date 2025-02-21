"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddFoodItemForm({
  branches,
  categories,
  subcategories,
  addFoodItem,
}) {
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [foodImageFile, setFoodImageFile] = useState(null);

  const [variations, setVariations] = useState([]);
  const [variationName, setVariationName] = useState("");
  const [variationPrice, setVariationPrice] = useState("");

  useEffect(() => {
    if (selectedBranchId) {
      const filtered = categories.filter((cat) => {
        return cat.branch === selectedBranchId || cat.branch?._id === selectedBranchId;
      });
      setFilteredCategories(filtered);
      setSelectedCategoryId("");
    } else {
      setFilteredCategories([]);
      setSelectedCategoryId("");
    }
  }, [selectedBranchId, categories]);

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = subcategories.filter((sub) => {
        return sub.category === selectedCategoryId || sub.category?._id === selectedCategoryId;
      });
      setFilteredSubcategories(filtered);
      setSelectedSubcategoryId("");
    } else {
      setFilteredSubcategories([]);
      setSelectedSubcategoryId("");
    }
  }, [selectedCategoryId, subcategories]);

  const handleFileChange = (e) => {
    setFoodImageFile(e.target.files[0]);
  };

  const addVariation = () => {
    if (!variationName.trim() || !variationPrice) {
      toast.error("Please provide both variation name and price.");
      return;
    }
    setVariations([
      ...variations,
      { name: variationName.trim(), price: parseFloat(variationPrice) },
    ]);
    setVariationName("");
    setVariationPrice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedBranchId ||
      !selectedCategoryId ||
      !selectedSubcategoryId ||
      !title.trim() ||
      (variations.length === 0 && !price) ||
      !foodImageFile
    ) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const formData = new FormData();
    formData.append("branch", selectedBranchId);
    formData.append("category", selectedCategoryId);
    formData.append("subcategory", selectedSubcategoryId);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (variations.length === 0) {
      formData.append("price", price);
    }
    formData.append("foodImage", foodImageFile);

    if (variations.length > 0) {
      formData.append("variations", JSON.stringify(variations));
    }

    try {
      await addFoodItem(formData);
      toast.success("Food item added successfully!");
      // Reset form
      setSelectedBranchId("");
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
      setTitle("");
      setDescription("");
      setPrice("");
      setFoodImageFile(null);
      setVariations([]);
    } catch (error) {
      toast.error("Error adding food item: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Select Branch</label>
        <select
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Branch --</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Select Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full border rounded p-2"
          disabled={!selectedBranchId}
        >
          <option value="">-- Select Category --</option>
          {filteredCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Select Subcategory</label>
        <select
          value={selectedSubcategoryId}
          onChange={(e) => setSelectedSubcategoryId(e.target.value)}
          className="w-full border rounded p-2"
          disabled={!selectedCategoryId}
        >
          <option value="">-- Select Subcategory --</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Item Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter item title"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter description (optional)"
        ></textarea>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Price{" "}
          {variations.length > 0 && "(Disabled because variations determine the price)"}
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter price"
          disabled={variations.length > 0}
        />
        {variations.length > 0 && (
          <p className="text-sm text-gray-600">
            Price is determined by the selected variation.
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border rounded p-2"
          accept="image/*"
        />
      </div>

      {/* Variations Section */}
      <div>
        <label className="block font-medium mb-1">Variations (optional)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={variationName}
            onChange={(e) => setVariationName(e.target.value)}
            placeholder="Variation Name (e.g., Small)"
            className="w-1/2 border rounded p-2"
          />
          <input
            type="number"
            value={variationPrice}
            onChange={(e) => setVariationPrice(e.target.value)}
            placeholder="Price"
            className="w-1/2 border rounded p-2"
          />
          <button
            type="button"
            onClick={addVariation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Variation
          </button>
        </div>
        {variations.length > 0 && (
          <ul className="list-disc pl-5">
            {variations.map((v, index) => (
              <li key={index}>
                {v.name}: {v.price} Rs
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Add Food Item
      </button>
    </form>
  );
}
