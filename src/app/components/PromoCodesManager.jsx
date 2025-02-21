"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function PromoCodesManager() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch("/api/promocodes");
      const data = await res.json();
      setPromoCodes(data);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Error fetching promo codes");
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    if (!newCode || discount <= 0) {
      toast.error("Enter a valid promo code and discount");
      return;
    }
    try {
      const res = await fetch("/api/promocodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode, discount }),
      });
      if (res.ok) {
        const createdCode = await res.json();
        setPromoCodes((prev) => [...prev, createdCode]);
        setNewCode("");
        setDiscount(0);
        toast.success("Promo code created");
      } else {
        toast.error("Failed to create promo code");
      }
    } catch (error) {
      console.error("Error creating promo code:", error);
      toast.error("Error creating promo code");
    }
  };

  const handleDeletePromoCode = async (id) => {
    try {
      const res = await fetch(`/api/promocodes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPromoCodes((prev) => prev.filter((code) => code._id !== id));
        toast.success("Promo code deleted");
      } else {
        toast.error("Failed to delete promo code");
      }
    } catch (error) {
      console.error("Error deleting promo code:", error);
      toast.error("Error deleting promo code");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Promo Codes</h2>
      <form onSubmit={handleCreatePromoCode} className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Promo Code"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-32 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Create
        </button>
      </form>
      <div>
        {promoCodes.length === 0 ? (
          <p className="text-gray-600">No promo codes available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {promoCodes.map((code) => (
              <li key={code._id} className="flex items-center justify-between p-2">
                <div>
                  <span className="font-semibold">{code.code}</span> - {code.discount}% off
                </div>
                <button
                  onClick={() => handleDeletePromoCode(code._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
