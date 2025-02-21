"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import whatsapp from "../../../public/whatsapp-logo.png";
import { useBranchStore } from "@/store/branchStore";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchedBranches, setFetchedBranches] = useState([]);

  const { branch, setBranch } = useBranchStore();

  useEffect(() => {
    async function getBranches() {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();
        setFetchedBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    }
    getBranches();
  }, []);

  const handleLocationChange = (selectedBranch) => {
    setBranch(selectedBranch);
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-[80%] m-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 z-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full border-[3px] sm:border-4 border-yellow-400 overflow-hidden -mt-8 sm:-mt-10 md:-mt-14">
        <Image src="/Logo.jpeg" alt="Logo" fill className="object-cover" />
      </div>

      <div className="pt-8 sm:pt-20 md:pt-24 lg:pt-24 pb-2 md:pb-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-col text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
                Restaurant Name
              </h1>
              <div className="flex flex-col gap-1.5">
                <div className="text-red-600 text-xs sm:text-sm md:text-base">
                  <span>Open: </span>
                  <span className="font-normal text-black">11:30 am to 3:30 am</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1 text-red-600 text-xs sm:text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <span>Branch:</span>
                    <span className="font-normal text-black">
                      {branch?.name || "Select Location"}
                    </span>
                  </div>
                  <span
                    onClick={() => setIsModalOpen(true)}
                    className="underline hover:text-red-700 text-[11px] sm:text-xs cursor-pointer"
                  >
                    {branch ? "Change Location" : "Choose Location"}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <div className="bg-white rounded-md px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 shadow-md">
                <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-black font-semibold text-sm sm:text-base">
                      30-45 mins
                    </span>
                    <span className="text-gray-600 text-[11px] sm:text-xs">
                      Delivery Time
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-black font-semibold text-sm sm:text-base">
                      Rs. 500 Only
                    </span>
                    <span className="text-gray-600 text-[11px] sm:text-xs">
                      Minimum Order
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {[
                { src: "/download.png", bg: "bg-red-700" },
                { src: whatsapp.src, bg: "bg-[rgb(42,168,26)]" },
                { src: "/phone.png", bg: "bg-blue-500" },
                { src: "/facebook.png", bg: "bg-[rgb(12,144,242)]" },
                {
                  src: "/instagram.png",
                  bg: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`${item.bg} rounded relative hover:opacity-90 transition-opacity w-8 h-8 sm:w-10 sm:h-10`}
                >
                  <Image
                    src={item.src}
                    alt="Social"
                    fill
                    className="object-contain scale-90 p-1.5"
                    sizes="(max-width: 640px) 32px, 40px"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 w-72 transform transition-all duration-300 scale-100 mx-4">
            <h2 className="text-2xl font-semibold mb-4">Select Your Location</h2>
            <p className="text-gray-600 mb-6">Please choose your preferred branch:</p>
            <div className="flex flex-col gap-3">
              {fetchedBranches.map((b) => (
                <button
                  key={b._id}
                  onClick={() => handleLocationChange(b)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {b.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
