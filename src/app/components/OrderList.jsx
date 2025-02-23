import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [orderNumbers, setOrderNumbers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const [dateFilter, setDateFilter] = useState("all"); 
  const [customDate, setCustomDate] = useState("");    
  const [typeFilter, setTypeFilter] = useState("all"); 

  const extractValue = (field) => {
    if (typeof field === "object" && field !== null) {
      if (field.$numberInt) {
        return parseInt(field.$numberInt, 10);
      }
      if (field.$numberLong) {
        return parseInt(field.$numberLong, 10);
      }
      if (field.$oid) {
        return field.$oid;
      }
      if (field.$date) {
        if (typeof field.$date === "object" && field.$date.$numberLong) {
          return new Date(parseInt(field.$date.$numberLong, 10));
        } else {
          return new Date(field.$date);
        }
      }
    }
    return field;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      if (Array.isArray(data)) {
        setOrders(data);
        const mapping = {};
        data.forEach((order, index) => {
          const idVal = String(extractValue(order._id));
          mapping[idVal] = "tipu-" + (index + 1).toString().padStart(3, "0");
        });
        setOrderNumbers(mapping);
      } else {
        console.error("Expected an array but got:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (orderId, currentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      if (!res.ok) {
        console.error("Failed to update order completion");
        return;
      }
      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((order) =>
          String(extractValue(order._id)) === orderId ? updatedOrder : order
        )
      );
      if (
        selectedOrder &&
        String(extractValue(selectedOrder._id)) === orderId
      ) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Failed to delete order. Status:", res.status);
        return;
      }
      setOrders((prev) =>
        prev.filter((order) => String(extractValue(order._id)) !== orderId)
      );
      if (selectedOrder && String(extractValue(selectedOrder._id)) === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  const printOrderDetails = (order) => {
    const newWindow = window.open("", "_blank", "width=800,height=600");
    const itemsList = order.items
      .map((item) => {
        const price = extractValue(item.price);
        return `<li>${item.name} - ${price} Rs ${
          item.type ? `(Type: ${item.type})` : ""
        }</li>`;
      })
      .join("");

    const subtotal = extractValue(order.subtotal);
    const tax = extractValue(order.tax);
    const discount = extractValue(order.discount);
    const total = extractValue(order.total);
    const branch = order.branch ? String(extractValue(order.branch)) : "";
    const createdAt = order.createdAt
      ? new Date(order.createdAt).toLocaleString()
      : "";

    const printStyles = `
      <style>
        body {
          font-family: sans-serif;
          margin: 20px;
        }
        h2 {
          margin-bottom: 1rem;
        }
        .details p {
          margin: 4px 0;
        }
        ul {
          margin-left: 20px;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
      </style>
    `;

    const htmlContent = `
      <html>
        <head>
          <title>Order Print</title>
          ${printStyles}
        </head>
        <body>
          <h2>Order Details</h2>
          <div class="details">
            <p><strong>Full Name:</strong> ${order.fullName}</p>
            <p><strong>Mobile:</strong> ${order.mobileNumber}</p>
            ${
              order.alternateMobile
                ? `<p><strong>Alternate Mobile:</strong> ${order.alternateMobile}</p>`
                : ""
            }
            ${
              order.email
                ? `<p><strong>Email:</strong> ${order.email}</p>`
                : ""
            }
            ${
              order.deliveryAddress
                ? `<p><strong>Address:</strong> ${order.deliveryAddress}</p>`
                : ""
            }
            ${
              order.nearestLandmark
                ? `<p><strong>Nearest Landmark:</strong> ${order.nearestLandmark}</p>`
                : ""
            }
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            ${
              order.promoCode
                ? `<p><strong>Promo Code:</strong> ${order.promoCode}</p>`
                : ""
            }
          </div>
          <div class="mt-2">
            <strong>Items:</strong>
            <ul>
              ${itemsList}
            </ul>
          </div>
          <div class="mt-2">
            <p><strong>Subtotal:</strong> ${subtotal} Rs</p>
            <p><strong>Tax:</strong> ${tax} Rs</p>
            <p><strong>Discount:</strong> ${discount} Rs</p>
            <p><strong>Total:</strong> ${total} Rs</p>
          </div>
          ${
            order.isGift && order.giftMessage
              ? `<p class="mt-2"><strong>Gift Message:</strong> ${order.giftMessage}</p>`
              : ""
          }
          ${
            branch
              ? `<p class="mt-2"><strong>Branch:</strong> ${branch}</p>`
              : ""
          }
          ${
            createdAt
              ? `<p class="mt-2"><strong>Order Date:</strong> ${createdAt}</p>`
              : ""
          }
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);

    if (dateFilter === "today") {
      const now = new Date();
      if (
        orderDate.getFullYear() !== now.getFullYear() ||
        orderDate.getMonth() !== now.getMonth() ||
        orderDate.getDate() !== now.getDate()
      ) {
        return false;
      }
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        orderDate.getFullYear() !== yesterday.getFullYear() ||
        orderDate.getMonth() !== yesterday.getMonth() ||
        orderDate.getDate() !== yesterday.getDate()
      ) {
        return false;
      }
    } else if (dateFilter === "custom" && customDate) {
      const selectedDate = new Date(customDate);
      if (
        orderDate.getFullYear() !== selectedDate.getFullYear() ||
        orderDate.getMonth() !== selectedDate.getMonth() ||
        orderDate.getDate() !== selectedDate.getDate()
      ) {
        return false;
      }
    }

    if (typeFilter === "pickup") {
      if (order.orderType !== "pickup") return false;
    } else if (typeFilter === "delivery") {
      if (order.orderType !== "delivery") return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Order List</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="flex gap-2 items-center">
          <label htmlFor="dateFilter" className="font-medium">
            Filter by Date:
          </label>
          <select
            id="dateFilter"
            className="px-3 py-1 border rounded"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              if (e.target.value !== "custom") {
                setCustomDate("");
              }
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom</option>
          </select>
          {dateFilter === "custom" && (
            <input
              type="date"
              className="px-3 py-1 border rounded"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          )}
        </div>

        <div className="flex gap-2 items-center">
          <label htmlFor="typeFilter" className="font-medium">
            Filter by Type:
          </label>
          <select
            id="typeFilter"
            className="px-3 py-1 border rounded"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <>
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border text-left">Sr No</th>
                <th className="p-2 border text-left">Order No</th>
                <th className="p-2 border text-left">Customer Name</th>
                <th className="p-2 border text-left w-24">Area</th>
                <th className="p-2 border text-left">Amount</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">View</th>
                <th className="p-2 border text-left">Print</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => {
                const idVal = String(extractValue(order._id));
                const orderNumber = orderNumbers[idVal] || "tipu-000";
                const status = order.isCompleted ? "Completed" : "Pending";
                const srNo = ((currentPage - 1) * ordersPerPage + index + 1)
                  .toString()
                  .padStart(2, "0");

                return (
                  <tr key={idVal} className="hover:bg-gray-100">
                    <td className="p-2 border">{srNo}</td>
                    <td className="p-2 border">{orderNumber}</td>
                    <td className="p-2 border">{order.fullName}</td>
                    <td className="p-2 border w-24">
                      {order.branch1 ? String(extractValue(order.branch)) : "Clifton"}
                    </td>
                    <td className="p-2 border">
                      {extractValue(order.total) || 0}/-
                    </td>
                    <td className="p-2 border">
                      <span
                        className={`font-semibold ${
                          order.isCompleted ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-5 w-5 inline-block" />
                      </button>
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          printOrderDetails(order);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline-block"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 8H5c-1.1 0-2 .9-2 2v4h4v5h10v-5h4v-4c0-1.1-.9-2-2-2zm-3 9H8v-5h8v5zm3-11V3H6v3H4v4h16V6h-1z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-blue-600 text-white" : "bg-white text-black"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p>
              <strong>Full Name:</strong> {selectedOrder.fullName}
            </p>
            <p>
              <strong>Mobile:</strong> {selectedOrder.mobileNumber}
            </p>
            {selectedOrder.alternateMobile && (
              <p>
                <strong>Alternate Mobile:</strong> {selectedOrder.alternateMobile}
              </p>
            )}
            {selectedOrder.email && (
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
            )}
            {selectedOrder.deliveryAddress && (
              <p>
                <strong>Address:</strong> {selectedOrder.deliveryAddress}
              </p>
            )}
            {selectedOrder.nearestLandmark && (
              <p>
                <strong>Nearest Landmark:</strong> {selectedOrder.nearestLandmark}
              </p>
            )}
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            {selectedOrder.promoCode && (
              <p>
                <strong>Promo Code:</strong> {selectedOrder.promoCode}
              </p>
            )}
            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="list-disc ml-6">
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>
                    {item.name} - {extractValue(item.price)} Rs{" "}
                    {item.type && `(Type: ${item.type})`}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p>
                <strong>Subtotal:</strong> {extractValue(selectedOrder.subtotal)} Rs
              </p>
              <p>
                <strong>Tax:</strong> {extractValue(selectedOrder.tax)} Rs
              </p>
              <p>
                <strong>Discount:</strong> {extractValue(selectedOrder.discount)} Rs
              </p>
              <p>
                <strong>Total:</strong> {extractValue(selectedOrder.total)} Rs
              </p>
            </div>
            {selectedOrder.isGift && selectedOrder.giftMessage && (
              <p className="mt-2">
                <strong>Gift Message:</strong> {selectedOrder.giftMessage}
              </p>
            )}
            <p className="mt-2">
              <strong>Branch:</strong> Clifton
            </p>
            {selectedOrder.createdAt && (
              <p className="mt-2 text-sm text-gray-600">
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            )}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() =>
                  toggleCompletion(
                    String(extractValue(selectedOrder._id)),
                    selectedOrder.isCompleted
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {selectedOrder.isCompleted
                  ? "Mark as Pending"
                  : "Mark as Completed"}
              </button>
              <button
                onClick={() =>
                  deleteOrder(String(extractValue(selectedOrder._id)))
                }
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
