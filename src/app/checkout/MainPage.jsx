"use client";
import { useState, useEffect } from "react";
import { FaCreditCard, FaMoneyBill } from "react-icons/fa";
import { toast } from "react-toastify";
import { useOrderTypeStore } from "../../store/orderTypeStore";
import { useCartStore } from "../../store/cart";
import { useBranchStore } from "../../store/branchStore";
import DeliveryPickupModal from "../components/DeliveryPickupModal";
import { areasOfLahore } from "../lib/deliveryAreas";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Mr.");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [nearestLandmark, setNearestLandmark] = useState("");
  const [email, setEmail] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [changeRequest, setChangeRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [receiptFile, setReceiptFile] = useState(null);

  const [paymentType, setPaymentType] = useState("cod");
  const [onlineOption, setOnlineOption] = useState(null);

  const { orderType } = useOrderTypeStore();
  const { branch } = useBranchStore();
  const { items, total, clearCart } = useCartStore();
  const subtotal = total;
  const tax = 0;
  const deliveryFee = selectedArea ? selectedArea.fee : 0;
  const grandTotal = subtotal + tax + deliveryFee - appliedDiscount;

  const easypaisaDetails = {
    title: "EasyPaisa Payment Details",
    accountNumber: "111222333",
    accountName: "EasyPaisa Merchant",
    instructions:
      "Transfer using the EasyPaisa app and upload a screenshot of your transaction.",
  };

  const jazzcashDetails = {
    title: "JazzCash Payment Details",
    accountNumber: "444555666",
    accountName: "JazzCash Merchant",
    instructions:
      "Pay via JazzCash and upload a screenshot of your payment confirmation.",
  };

  const bankTransferDetails = {
    title: "Bank Transfer Details",
    bankName: "ABC Bank",
    accountNumber: "1234567890",
    accountName: "Your Business Name",
    branch: "Main Branch",
    instructions:
      "Transfer the payment to the bank account and upload the transaction receipt.",
  };

  useEffect(() => {
    async function fetchPromoCodes() {
      try {
        const res = await fetch("/api/promocodes");
        if (res.ok) {
          const data = await res.json();
          setPromoCodes(data);
        } else {
          toast.error("Failed to fetch promo codes. Please try again later.", {
            style: { background: "#dc2626", color: "#ffffff" },
          });
        }
      } catch (error) {
        console.error("Error fetching promo codes:", error);
        toast.error("Error fetching promo codes. Please try again later.", {
          style: { background: "#dc2626", color: "#ffffff" },
        });
      }
    }
    fetchPromoCodes();
  }, []);

  useEffect(() => {
    setAppliedDiscount(subtotal * 0.1);
  }, [subtotal]);
  
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    const found = promoCodes.find(
      (p) => p.code.toLowerCase() === promoCode.trim().toLowerCase()
    );
    if (found && found.discount > 0) {
      const totalDiscountPercentage = 10 + found.discount;
      const newDiscount = subtotal * (totalDiscountPercentage / 100);
      setAppliedDiscount(newDiscount);
      toast.success("Promo code applied successfully!", {
        style: { background: "#16a34a", color: "#ffffff" },
      });
    } else {
      setAppliedDiscount(subtotal * 0.1);
      toast.error("Invalid promo code. Please try a different code.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
    }
  };
  
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items before placing an order.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    if (!fullName.trim() || !mobileNumber.trim() || !deliveryAddress.trim()) {
      toast.error("Please fill in all required fields.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    const phoneRegex = /^03[0-9]{9}$/;
    if (!phoneRegex.test(mobileNumber.trim())) {
      alert("Please enter a valid number")
      toast.error("Please enter a valid number", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    if (!branch || !orderType) {
      toast.error("Please select your branch and order type.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    if (!selectedArea) {
      toast.error("Please select your delivery area.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    if (subtotal < 500) {
      toast.error("Minimum order value is Rs. 500. Please add more items to your order.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    if (grandTotal < 0) {
      toast.error("The total amount cannot be negative. Please review your order.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
      return;
    }
    if (paymentType === "online") {
      if (!onlineOption) {
        toast.error("Please select an online payment option.", {
          style: { background: "#dc2626", color: "#ffffff" },
        });
        return;
      }
      if (!receiptFile) {
        toast.error("Please upload your payment receipt.", {
          style: { background: "#dc2626", color: "#ffffff" },
        });
        return;
      }
    }
    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        type: item.type,
      }));
      const completeAddress = deliveryAddress.trim() + ", " + selectedArea.name;

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("mobileNumber", mobileNumber);
      formData.append("alternateMobile", alternateMobile);
      formData.append("deliveryAddress", completeAddress);
      formData.append("nearestLandmark", nearestLandmark);
      formData.append("email", email);
      formData.append("paymentInstructions", paymentInstructions);
      formData.append("paymentMethod", paymentType);
      formData.append("subtotal", subtotal.toString());
      formData.append("tax", tax.toString());
      formData.append("discount", appliedDiscount.toString());
      formData.append("total", grandTotal.toString());
      formData.append("promoCode", promoCode);
      formData.append("isGift", isGift ? "true" : "false");
      formData.append("giftMessage", giftMessage);
      formData.append("orderType", orderType);
      formData.append("branch", branch?._id);
      formData.append("area", selectedArea.name);
      formData.append("items", JSON.stringify(orderItems));
      formData.append("changeRequest", changeRequest);

      if (paymentType === "online") {
        formData.append("receiptImage", receiptFile);
        let bankNameField = "";
        if (onlineOption === "easypaisa") bankNameField = "EasyPaisa";
        else if (onlineOption === "jazzcash") bankNameField = "JazzCash";
        else if (onlineOption === "bank_transfer")
          bankNameField = bankTransferDetails.bankName;
        formData.append("bankName", bankNameField);
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      const data = await response.json();
      console.log("Order placed successfully:", data);
      clearCart();
      resetFormFields();
      router.push("/");
      toast.success("Your order has been placed successfully!", {
        style: { background: "#16a34a", color: "#ffffff" },
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while placing your order. Please try again later.", {
        style: { background: "#dc2626", color: "#ffffff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormFields = () => {
    setTitle("Mr.");
    setFullName("");
    setMobileNumber("");
    setAlternateMobile("");
    setDeliveryAddress("");
    setNearestLandmark("");
    setEmail("");
    setPaymentInstructions("");
    setPaymentType("cod");
    setOnlineOption(null);
    setPromoCode("");
    setIsGift(false);
    setGiftMessage("");
    setAppliedDiscount(0);
    setSelectedArea(null);
    setReceiptFile(null);
    setChangeRequest("");
  };

  return (
    <>
      {(!branch || !orderType) && <DeliveryPickupModal />}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <img src="/logo.png" alt="Logo" className="h-24 sm:h-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Checkout
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    This is a Delivery Order <span className="text-red-600">🚚</span>
                    <br />
                    Just a last step, please enter your details:
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-gray-700 mb-1">Title</label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    >
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Ms.</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*Required</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*Required</span>
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                      placeholder="03xx-xxxxxxx"
                      pattern="^03[0-9]{9}$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Alternate Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={alternateMobile}
                      onChange={(e) => setAlternateMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                      placeholder="03xx-xxxxxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*Required</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="Enter your complete address"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Select Area <span className="text-red-500">*Required</span>
                  </label>
                  <select
                    value={selectedArea ? selectedArea.name : ""}
                    onChange={(e) => {
                      const selected = areasOfLahore.find(
                        (area) => area.name === e.target.value
                      );
                      setSelectedArea(selected);
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                  >
                    <option value="">Select an area</option>
                    {areasOfLahore.map((area) => (
                      <option key={area.name} value={area.name}>
                        {area.name} (Fee: Rs. {area.fee})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nearest Landmark
                    </label>
                    <input
                      type="text"
                      value={nearestLandmark}
                      onChange={(e) => setNearestLandmark(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                      placeholder="Any famous place nearby"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Payment Instructions
                  </label>
                  <textarea
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md"
                    placeholder="Any notes or instructions about payment?"
                    rows={3}
                  />
                </div>
                {/* Removed gift message section */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Payment Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentType("cod");
                        setOnlineOption(null);
                        setReceiptFile(null);
                      }}
                      className={`p-4 border rounded-md flex items-center justify-center space-x-2 ${
                        paymentType === "cod"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaMoneyBill className="text-green-500" size={24} />
                      <span>Cash on Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentType("online");
                        setOnlineOption(null);
                        setReceiptFile(null);
                      }}
                      className={`p-4 border rounded-md flex items-center justify-center space-x-2 ${
                        paymentType === "online"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaCreditCard className="text-blue-500" size={24} />
                      <span>Online Payment</span>
                    </button>
                  </div>
                </div>
                {paymentType === "online" && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOnlineOption("easypaisa");
                          setReceiptFile(null);
                        }}
                        className={`p-4 border rounded-md flex flex-col items-center justify-center space-y-2 ${
                          onlineOption === "easypaisa"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <FaCreditCard className="text-green-500" size={24} />
                        <span>EasyPaisa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOnlineOption("jazzcash");
                          setReceiptFile(null);
                        }}
                        className={`p-4 border rounded-md flex flex-col items-center justify-center space-y-2 ${
                          onlineOption === "jazzcash"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <FaCreditCard className="text-blue-500" size={24} />
                        <span>JazzCash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOnlineOption("bank_transfer");
                          setReceiptFile(null);
                        }}
                        className={`p-4 border rounded-md flex flex-col items-center justify-center space-y-2 ${
                          onlineOption === "bank_transfer"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <FaCreditCard className="text-red-500" size={24} />
                        <span>Bank Transfer</span>
                      </button>
                    </div>
                    {onlineOption === "easypaisa" && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-50">
                        <h3 className="text-lg font-semibold mb-2">
                          {easypaisaDetails.title}
                        </h3>
                        <p>
                          <strong>Account Number:</strong>{" "}
                          {easypaisaDetails.accountNumber}
                        </p>
                        <p>
                          <strong>Account Name:</strong>{" "}
                          {easypaisaDetails.accountName}
                        </p>
                        <p>
                          <strong>Instructions:</strong>{" "}
                          {easypaisaDetails.instructions}
                        </p>
                        <div className="mt-4">
                          <label className="block text-sm text-gray-700 mb-1">
                            Upload Payment Receipt <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setReceiptFile(e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md"
                          />
                        </div>
                      </div>
                    )}
                    {onlineOption === "jazzcash" && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-50">
                        <h3 className="text-lg font-semibold mb-2">
                          {jazzcashDetails.title}
                        </h3>
                        <p>
                          <strong>Account Number:</strong>{" "}
                          {jazzcashDetails.accountNumber}
                        </p>
                        <p>
                          <strong>Account Name:</strong>{" "}
                          {jazzcashDetails.accountName}
                        </p>
                        <p>
                          <strong>Instructions:</strong>{" "}
                          {jazzcashDetails.instructions}
                        </p>
                        <div className="mt-4">
                          <label className="block text-sm text-gray-700 mb-1">
                            Upload Payment Receipt <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setReceiptFile(e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md"
                          />
                        </div>
                      </div>
                    )}
                    {onlineOption === "bank_transfer" && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-50">
                        <h3 className="text-lg font-semibold mb-2">
                          {bankTransferDetails.title}
                        </h3>
                        <p>
                          <strong>Bank:</strong> {bankTransferDetails.bankName}
                        </p>
                        <p>
                          <strong>Account Number:</strong>{" "}
                          {bankTransferDetails.accountNumber}
                        </p>
                        <p>
                          <strong>Account Name:</strong>{" "}
                          {bankTransferDetails.accountName}
                        </p>
                        <p>
                          <strong>Branch:</strong> {bankTransferDetails.branch}
                        </p>
                        <p>
                          <strong>Instructions:</strong>{" "}
                          {bankTransferDetails.instructions}
                        </p>
                        <div className="mt-4">
                          <label className="block text-sm text-gray-700 mb-1">
                            Upload Payment Receipt <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setReceiptFile(e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {paymentType === "cod" && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Change Request
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200 rounded-l-md bg-gray-50">
                        Rs.
                      </span>
                      <input
                        type="text"
                        value={changeRequest}
                        onChange={(e) => setChangeRequest(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-r-md"
                        placeholder="500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky top-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Your Order</h2>
                </div>
                <span className="text-lg sm:text-xl font-semibold">Rs. {subtotal}</span>
              </div>
              {items.length > 0 && (
                <div className="mb-4 space-y-2">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between text-sm text-gray-700">
                      <span>
                        {item.title} x {item.quantity}
                      </span>
                      <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-4 text-sm sm:text-base text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (0%)</span>
                  <span>Rs. {tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-yellow-500">
                  <span>Discount</span>
                  <span>Rs. {appliedDiscount}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Grand Total</span>
                  <span>Rs. {grandTotal}</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
                <a
                  href="/"
                  className="block mt-4 text-center text-blue-500 hover:underline text-sm sm:text-base"
                >
                  ← continue to add more items
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
