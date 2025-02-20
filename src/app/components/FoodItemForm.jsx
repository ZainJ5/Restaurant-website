import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddFoodItemForm({
  categories,
  subcategories,
  addFoodItem,
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [foodImageFile, setFoodImageFile] = useState(null);

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = subcategories.filter((sub) => {
        if (typeof sub.category === "object" && sub.category !== null) {
          return sub.category._id === selectedCategoryId;
        }
        return sub.category === selectedCategoryId;
      });
      setFilteredSubcategories(filtered);
      setSelectedSubcategoryId(filtered[0]?._id || "");
    } else {
      setFilteredSubcategories([]);
      setSelectedSubcategoryId("");
    }
  }, [selectedCategoryId, subcategories]);

  const handleFileChange = (e) => {
    setFoodImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedCategoryId ||
      !selectedSubcategoryId ||
      !title.trim() ||
      !price ||
      !foodImageFile
    ) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("category", selectedCategoryId);
    formData.append("subcategory", selectedSubcategoryId);
    formData.append("foodImage", foodImageFile);

    try {
      await addFoodItem(formData);
      toast.success("Food item added successfully!");
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
      setTitle("");
      setDescription("");
      setPrice("");
      setFoodImageFile(null);
    } catch (error) {
      toast.error("Error adding food item: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Select Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">
          Select Subcategory
        </label>
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
        <label className="block font-medium mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter price"
        />
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
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Add Food Item
      </button>
    </form>
  );
}
