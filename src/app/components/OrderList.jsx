import { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Filter options: "all", "today", "completed", "pending"
  const [filter, setFilter] = useState("all");

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
          extractValue(order._id) === extractValue(updatedOrder._id)
            ? updatedOrder
            : order
        )
      );
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
        console.error("Failed to delete order");
        return;
      }
      setOrders((prev) =>
        prev.filter((order) => extractValue(order._id) !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Filter orders based on the selected filter
  const filteredOrders = orders.filter((order) => {
    if (filter === "today") {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }
      return false;
    } else if (filter === "completed") {
      return order.isCompleted;
    } else if (filter === "pending") {
      return !order.isCompleted;
    }
    return true; // "all"
  });

  if (loading) return <p className="text-center py-8">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Order List</h2>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-2 rounded ${
            filter === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Today's Orders
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${
            filter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Pending
        </button>
      </div>
      {filteredOrders.length === 0 ? (
        <p className="text-center">No orders found for the selected filter.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const id = extractValue(order._id);
            const total = extractValue(order.total);
            const subtotal = extractValue(order.subtotal);
            const tax = extractValue(order.tax);
            const discount = extractValue(order.discount);
            return (
              <div
                key={id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h3 className="font-bold text-xl mb-2">
                  Order for: {order.fullName}
                </h3>
                <p className="mb-1">
                  <strong>Mobile:</strong> {order.mobileNumber}{" "}
                  {order.alternateMobile && (
                    <span>(Alternate: {order.alternateMobile})</span>
                  )}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {order.email}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
                {order.nearestLandmark && (
                  <p className="mb-1">
                    <strong>Nearest Landmark:</strong> {order.nearestLandmark}
                  </p>
                )}
                <div className="my-2">
                  <p>
                    <strong>Subtotal:</strong> {subtotal} Rs
                  </p>
                  <p>
                    <strong>Tax:</strong> {tax} Rs
                  </p>
                  <p>
                    <strong>Discount:</strong> {discount} Rs
                  </p>
                  <p>
                    <strong>Total:</strong> {total} Rs
                  </p>
                </div>
                {order.promoCode && (
                  <p className="mb-1">
                    <strong>Promo Code:</strong> {order.promoCode}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                {order.paymentInstructions && (
                  <p className="mb-1">
                    <strong>Payment Instructions:</strong>{" "}
                    {order.paymentInstructions}
                  </p>
                )}
                {order.changeRequest && (
                  <p className="mb-1">
                    <strong>Change Request:</strong> {order.changeRequest}
                  </p>
                )}
                {order.orderType && (
                  <p className="mb-1">
                    <strong>Order Type:</strong> {order.orderType}
                  </p>
                )}
                {order.paymentMethod === "online" && (
                  <>
                    {order.bankName && (
                      <p className="mb-1">
                        <strong>Bank Name:</strong> {order.bankName}
                      </p>
                    )}
                    {order.receiptImageUrl && (
                      <p className="mb-1">
                        <strong>Receipt:</strong>{" "}
                        <a
                          href={order.receiptImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View Receipt
                        </a>
                      </p>
                    )}
                  </>
                )}
                <div className="my-3">
                  <strong>Items:</strong>
                  <ul className="list-disc ml-6 mt-1">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {extractValue(item.price)} Rs
                        {item.type && <span> (Type: {item.type})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => toggleCompletion(id, order.isCompleted)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    {order.isCompleted
                      ? "Mark as Incomplete"
                      : "Mark as Completed"}
                  </button>
                  {order.isCompleted && (
                    <button
                      onClick={() => deleteOrder(id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
