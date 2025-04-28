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
import { RefreshCw } from "lucide-react";

function Statistics() {
  const [stats, setStats] = useState({
    totalSales: 0,
    topItems: [],
    topAreas: [],
    monthlySales: [],
    weeklySales: [],
  });
  const [loading, setLoading] = useState(true);
  const [graphType, setGraphType] = useState("monthly"); // Toggle between monthly/weekly

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/statistics");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const salesData = graphType === "monthly" ? stats.monthlySales : stats.weeklySales;
  const graphLabel = graphType === "monthly" ? "Monthly Sales Trend" : "Weekly Sales Trend";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">E-commerce Statistics</h3>
        <button
          onClick={fetchStatistics}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Total Sales */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h4>
        <p className="text-3xl font-bold text-green-600">
          Rs. {stats.totalSales.toLocaleString()}
        </p>
      </div>

      {/* Top Items */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Items</h4>
        {stats.topItems.length > 0 ? (
          <ul className="space-y-3">
            {stats.topItems.map((item, index) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">
                  {index + 1}. {item.name}
                </span>
                <span className="text-gray-600">
                  {item.quantitySold} units (Rs. {item.totalRevenue.toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No items sold yet.</p>
        )}
      </div>

      {/* Top Areas */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Delivery Areas</h4>
        {stats.topAreas.length > 0 ? (
          <ul className="space-y-3">
            {stats.topAreas.map((area, index) => (
              <li
                key={area.name}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">
                  {index + 1}. {area.name}
                </span>
                <span className="text-gray-600">
                  {area.orderCount} orders (Rs. {area.totalRevenue.toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No orders in delivery areas yet.</p>
        )}
      </div>

      {/* Sales Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-700">{graphLabel}</h4>
          <button
            onClick={() => setGraphType(graphType === "monthly" ? "weekly" : "monthly")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Show {graphType === "monthly" ? "Weekly" : "Monthly"} Graph
          </button>
        </div>
        {salesData.length > 0 ? (
          <div className="h-64 flex items-end space-x-2">
            {salesData.map((data) => {
              const maxSales = Math.max(...salesData.map((m) => m.total));
              const heightPercentage = maxSales > 0 ? (data.total / maxSales) * 100 : 0;
              const label = graphType === "monthly"
                ? new Date(data.month + "-01").toLocaleString("default", {
                    month: "short",
                    year: "2-digit",
                  })
                : data.week; // Display as YYYY-WWW for weeks
              return (
                <div key={data.month || data.week} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-red-600 w-full rounded-t-md transition-all duration-300 hover:bg-red-700"
                    style={{ height: `${heightPercentage}%` }}
                    title={`Rs. ${data.total.toLocaleString()}`}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{label}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No sales data available.</p>
        )}
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const [selectedTab, setSelectedTab] = useState("branch");
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [siteStatus, setSiteStatus] = useState(true);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaFee, setNewAreaFee] = useState("");
  const [editingArea, setEditingArea] = useState(null);

  useEffect(() => {
    fetchBranches();
    fetchCategories();
    fetchSubcategories();
    fetchFoodItems();
    fetchSiteStatus();
    fetchDeliveryAreas();
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

  const fetchSiteStatus = async () => {
    try {
      const res = await fetch("/api/site-status");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setSiteStatus(data.isSiteActive);
    } catch (error) {
      console.error("Error fetching site status:", error);
    }
  };

  const fetchDeliveryAreas = async () => {
    try {
      const res = await fetch("/api/delivery-areas");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setDeliveryAreas(data);
    } catch (error) {
      console.error("Error fetching delivery areas:", error);
    }
  };

  const toggleSiteStatus = async () => {
    try {
      const newStatus = !siteStatus;
      const res = await fetch("/api/site-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSiteActive: newStatus }),
      });
      if (res.ok) {
        setSiteStatus(newStatus);
      } else {
        console.error("Failed to update site status");
      }
    } catch (error) {
      console.error("Error updating site status:", error);
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

  const addDeliveryArea = async (e) => {
    e.preventDefault();
    if (!newAreaName.trim() || !newAreaFee || newAreaFee < 0) {
      alert("Please enter a valid area name and fee.");
      return;
    }
    try {
      const res = await fetch("/api/delivery-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAreaName.trim(), fee: Number(newAreaFee) }),
      });
      if (res.ok) {
        const newArea = await res.json();
        setDeliveryAreas((prev) => [...prev, newArea]);
        setNewAreaName("");
        setNewAreaFee("");
        alert("Delivery area added successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add delivery area.");
      }
    } catch (error) {
      console.error("Error adding delivery area:", error);
      alert("Error adding delivery area.");
    }
  };

  const updateDeliveryArea = async (e) => {
    e.preventDefault();
    if (!editingArea.name.trim() || !editingArea.fee || editingArea.fee < 0) {
      alert("Please enter a valid area name and fee.");
      return;
    }
    try {
      const res = await fetch("/api/delivery-areas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editingArea._id,
          name: editingArea.name.trim(),
          fee: Number(editingArea.fee),
        }),
      });
      if (res.ok) {
        const updatedArea = await res.json();
        setDeliveryAreas((prev) =>
          prev.map((area) => (area._id === updatedArea._id ? updatedArea : area))
        );
        setEditingArea(null);
        alert("Delivery area updated successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update delivery area.");
      }
    } catch (error) {
      console.error("Error updating delivery area:", error);
      alert("Error updating delivery area.");
    }
  };

  const deleteDeliveryArea = async (areaId) => {
    if (!confirm("Are you sure you want to delete this delivery area?")) return;
    try {
      const res = await fetch("/api/delivery-areas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: areaId }),
      });
      if (res.ok) {
        setDeliveryAreas((prev) => prev.filter((area) => area._id !== areaId));
        alert("Delivery area deleted successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete delivery area.");
      }
    } catch (error) {
      console.error("Error deleting delivery area:", error);
      alert("Error deleting delivery area.");
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
      case "deliveryAreas":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Manage Delivery Areas</h3>
            <form onSubmit={editingArea ? updateDeliveryArea : addDeliveryArea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Area Name</label>
                <input
                  type="text"
                  value={editingArea ? editingArea.name : newAreaName}
                  onChange={(e) =>
                    editingArea
                      ? setEditingArea({ ...editingArea, name: e.target.value })
                      : setNewAreaName(e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter area name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  value={editingArea ? editingArea.fee : newAreaFee}
                  onChange={(e) =>
                    editingArea
                      ? setEditingArea({ ...editingArea, fee: e.target.value })
                      : setNewAreaFee(e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter delivery fee"
                  min="0"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {editingArea ? "Update Area" : "Add Area"}
                </button>
                {editingArea && (
                  <button
                    type="button"
                    onClick={() => setEditingArea(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <div>
              <h4 className="text-md font-semibold mb-2">Existing Delivery Areas</h4>
              {deliveryAreas.length === 0 ? (
                <p className="text-gray-500">No delivery areas added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {deliveryAreas.map((area) => (
                    <li
                      key={area._id}
                      className="flex justify-between items-center p-2 border-b border-gray-200"
                    >
                      <span>
                        {area.name} (Rs. {area.fee})
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => setEditingArea(area)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDeliveryArea(area._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      case "statistics":
        return <Statistics />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[92vh]">
        <div className="hidden md:block w-full md:w-1/4 bg-[#ba0000] text-white p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Admin Menu</h2>
          <button
            onClick={toggleSiteStatus}
            className={`w-full text-left px-3 py-2 mb-4 rounded-md text-sm font-medium transition duration-150 ${
              siteStatus ? "bg-green-600 hover:bg-green-700" : "bg-red-800 hover:bg-red-900"
            }`}
          >
            {siteStatus ? "Turn Site Off" : "Turn Site On"}
          </button>
          <ul className="space-y-2">
            {["branch", "category", "subcategory", "foodItem", "orders", "items", "allCategories", "allSubcategories", "promocodes", "deliveryAreas", "statistics"].map((tab) => (
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
          <button
            onClick={toggleSiteStatus}
            className={`w-full text-left px-3 py-2 mb-2 rounded-md text-sm font-medium transition duration-150 ${
              siteStatus ? "bg-green-600 hover:bg-green-700" : "bg-red-800 hover:bg-red-900"
            }`}
          >
            {siteStatus ? "Turn Site Off" : "Turn Site On"}
          </button>
          <div className="flex overflow-x-auto space-x-2">
            {["branch", "category", "subcategory", "foodItem", "orders", "items", "allCategories", "allSubcategories", "promocodes", "deliveryAreas", "statistics"].map((tab) => (
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