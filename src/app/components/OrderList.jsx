import { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
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
          order._id === updatedOrder._id ? updatedOrder : order
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
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
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
          {orders.map((order) => (
            <div key={order._id} className="border-b pb-2">
              <h3 className="font-bold text-lg">{order.fullName}</h3>
              <p>
                <strong>Mobile:</strong> {order.mobileNumber}
              </p>
              <p>
                <strong>Email:</strong> {order.email}
              </p>
              <p>
                <strong>Address:</strong> {order.deliveryAddress}
              </p>
              <p>
                <strong>Total:</strong> {order.total}Rs
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc ml-5">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.price}Rs
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() =>
                    toggleCompletion(order._id, order.isCompleted)
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  {order.isCompleted
                    ? "Mark as Incomplete"
                    : "Mark as Completed"}
                </button>
                {order.isCompleted && (
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
