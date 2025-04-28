"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function Statistics() {
  const [stats, setStats] = useState({
    totalSales: 0,
    topItems: [],
    topAreas: [],
    monthlySales: [],
    weeklySales: [],
  });
  const [loading, setLoading] = useState(true);
  const [graphType, setGraphType] = useState("monthly"); 

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

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h4>
        <p className="text-3xl font-bold text-green-600">
          Rs. {stats.totalSales.toLocaleString()}
        </p>
      </div>

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

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Delivery Areas</h4>
        {stats.topAreas.length > 0 ? (
          <ul className="space-y-3">
            {stats.topAreas.map((area, index) => (
              <li
                key={area.name || `area-${index}`}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">
                  {index + 1}. {area.name || "Unknown Area"}
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
        {salesData && salesData.length > 0 ? (
          <div className="h-64 flex items-end space-x-2">
            {salesData.map((data) => {
              const maxSales = Math.max(...salesData.map((m) => m.total));
              const heightPercentage = maxSales > 0 ? (data.total / maxSales) * 100 : 0;
              const label = graphType === "monthly"
                ? new Date(data.month + "-01").toLocaleString("default", {
                    month: "short",
                    year: "2-digit",
                  })
                : data.week; 
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