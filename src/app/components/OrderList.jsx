import { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [orderNumbers, setOrderNumbers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" for oldest first, "desc" for newest first

  // Helper to extract the value from a possible MongoDB extended JSON field.
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
        // Create a mapping from order _id (as string) to a fixed order number.
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

  // Sort orders by createdAt timestamp.
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Order List</h2>
        <div>
          <label htmlFor="sort" className="mr-2 font-medium">
            Sort by Date:
          </label>
          <select
            id="sort"
            className="px-3 py-1 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : sortedOrders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {sortedOrders.map((order) => {
            const idVal = String(extractValue(order._id));
            const orderNumber = orderNumbers[idVal] || "tipu-000";
            const status = order.isCompleted ? "Completed" : "Pending";
            return (
              <li
                key={idVal}
                className="cursor-pointer p-4 border rounded shadow hover:bg-gray-100 flex justify-between items-center"
                onClick={() => setSelectedOrder(order)}
              >
                <span className="font-semibold">{orderNumber}</span>
                <span
                  className={`font-semibold ${
                    order.isCompleted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal Popup for Order Details */}
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
            {selectedOrder.branch && (
              <p className="mt-2">
                <strong>Branch:</strong> {String(extractValue(selectedOrder.branch))}
              </p>
            )}
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
                {selectedOrder.isCompleted ? "Mark as Pending" : "Mark as Completed"}
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
