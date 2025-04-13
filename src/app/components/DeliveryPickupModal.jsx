"use client";
import { useEffect, useState } from "react";
import { useOrderTypeStore } from "../../store/orderTypeStore";
import { useBranchStore } from "../../store/branchStore";
import { Truck, ShoppingBag } from "lucide-react";

export default function DeliveryPickupModal() {
  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();

  const isBeforeOpening = (currentHour < 11) || (currentHour === 11 && currentMinutes < 30);
  const isAfterClosing = (currentHour >= 3 && currentHour < 11) || (currentHour === 11 && currentMinutes < 30);
  
  if (isBeforeOpening || isAfterClosing) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-md shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-red-600 text-white text-center py-4 px-6">
            <h2 className="text-2xl font-bold">Service timing 11:30am-3am</h2>
          </div>
        </div>
      </div>
    );
  }

  const { orderType, setOrderType } = useOrderTypeStore();
  const { branch, setBranch } = useBranchStore();
  
  const [branches, setBranches] = useState([
    {
      _id: "67b904f9397c3ee1c79e08d1",
      name: "Clifton",
      createdAt: "2025-02-21T22:58:01.942+00:00",
      updatedAt: "2025-02-21T22:58:01.942+00:00",
      __v: 0,
    },
  ]);
  
  useEffect(() => {
    if (!branch && branches.length > 0) {
      setBranch(branches[0]);
    }
  }, [branch, branches, setBranch]);

  // Commented out API call for branches
  /*
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    }
    fetchBranches();
  }, []);
  */

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (branch && orderType) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [branch, orderType]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
  };

  const handleBranchSelect = (selectedBranch) => {
    setBranch(selectedBranch);
  };

  if (!open) return null;

  const getBranchId = (b) => {
    return b._id?.$oid || b._id;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-md shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-red-600 text-white text-center py-4 px-6">
          <h2 className="text-2xl font-bold">Select your Order type</h2>
        </div>
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Branch</h3>
            <div className="grid grid-cols-2 gap-4">
              {branches.map((b) => {
                const branchId = getBranchId(b);
                const isSelected = branch && getBranchId(branch) === branchId;
                return (
                  <button
                    key={branchId}
                    onClick={() => handleBranchSelect(b)}
                    className={`w-full p-3 text-sm font-semibold border rounded-md 
                      transition-colors ${
                        isSelected
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-500"
                      }`}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Order Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleOrderTypeSelect("delivery")}
                className={`flex flex-col items-center p-4 border rounded-md 
                  transition-colors ${
                    orderType === "delivery"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-500"
                  }`}
              >
                <Truck
                  size={28}
                  className={`mb-2 ${
                    orderType === "delivery" ? "text-white" : "text-red-600"
                  }`}
                />
                <span className="font-semibold text-sm">Delivery</span>
              </button>
              <button
                onClick={() => handleOrderTypeSelect("pickup")}
                className={`flex flex-col items-center p-4 border rounded-md 
                  transition-colors ${
                    orderType === "pickup"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-500"
                  }`}
              >
                <ShoppingBag
                  size={28}
                  className={`mb-2 ${
                    orderType === "pickup" ? "text-white" : "text-red-600"
                  }`}
                />
                <span className="font-semibold text-sm">Pickup</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            You can change these preferences later in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}