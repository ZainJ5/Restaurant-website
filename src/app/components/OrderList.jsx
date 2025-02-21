import { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to extract values from MongoDB's nested types
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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders received.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto border rounded p-4 space-y-4">
          {orders.map((order) => {
            const id = extractValue(order._id);
            const total = extractValue(order.total);
            const subtotal = extractValue(order.subtotal);
            const tax = extractValue(order.tax);
            const discount = extractValue(order.discount);
            return (
              <div key={id} className="border-b pb-2">
                <h3 className="font-bold text-lg">
                  Order for: {order.fullName}
                </h3>
                <p>
                  <strong>Mobile:</strong> {order.mobileNumber}{" "}
                  {order.alternateMobile && (
                    <span>(Alternate: {order.alternateMobile})</span>
                  )}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
                {order.nearestLandmark && (
                  <p>
                    <strong>Nearest Landmark:</strong> {order.nearestLandmark}
                  </p>
                )}
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
                {order.promoCode && (
                  <p>
                    <strong>Promo Code:</strong> {order.promoCode}
                  </p>
                )}
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                {order.paymentInstructions && (
                  <p>
                    <strong>Payment Instructions:</strong>{" "}
                    {order.paymentInstructions}
                  </p>
                )}
                {order.changeRequest && (
                  <p>
                    <strong>Change Request:</strong> {order.changeRequest}
                  </p>
                )}
                <p>
                  <strong>Order Type:</strong> {order.orderType}
                </p>
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc ml-5">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {extractValue(item.price)} Rs
                        {item.type && <span> (Type: {item.type})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() =>
                      toggleCompletion(id, order.isCompleted)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    {order.isCompleted
                      ? "Mark as Incomplete"
                      : "Mark as Completed"}
                  </button>
                  {order.isCompleted && (
                    <button
                      onClick={() => deleteOrder(id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
